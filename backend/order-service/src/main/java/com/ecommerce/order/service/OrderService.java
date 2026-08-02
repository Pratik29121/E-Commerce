package com.ecommerce.order.service;

import com.ecommerce.order.client.ProductClient;
import com.ecommerce.order.dto.*;
import com.ecommerce.order.exception.NotFoundException;
import com.ecommerce.order.model.Order;
import com.ecommerce.order.model.OrderItem;
import com.ecommerce.order.model.OrderStatus;
import com.ecommerce.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductClient productClient;

    /**
     * Places an order. For each line item: fetch the current price from product-service,
     * then reserve stock. This is a synchronous, chatty call pattern on purpose for phase 1 -
     * it's the exact pain point that OpenFeign + Resilience4j (phase 2/3) and eventually a
     * Kafka-based saga (phase 3+) are introduced to solve, which is a great interview talking point.
     */
    public OrderResponse placeOrder(CreateOrderRequest request) {
        Order order = Order.builder()
                .userId(request.getUserId())
                .shippingAddress(request.getShippingAddress())
                .status(OrderStatus.PLACED)
                .totalAmount(BigDecimal.ZERO)
                .build();

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {
            ProductDto product = productClient.getProduct(itemRequest.getProductId());

            OrderItem item = OrderItem.builder()
                    .productId(product.getId())
                    .productName(product.getName())
                    .quantity(itemRequest.getQuantity())
                    .unitPrice(product.getPrice())
                    .build();
            order.addItem(item);

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())));
        }

        // Reserve stock only after every line item has been priced successfully.
        for (OrderItemRequest itemRequest : request.getItems()) {
            productClient.decreaseStock(itemRequest.getProductId(), itemRequest.getQuantity());
        }

        order.setTotalAmount(total);
        Order saved = orderRepository.save(order);
        return toResponse(saved);
    }

    public OrderResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    public List<OrderResponse> getByUser(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public OrderResponse updateStatus(Long id, OrderStatus status) {
        Order order = findOrThrow(id);
        order.setStatus(status);
        return toResponse(orderRepository.save(order));
    }

    private Order findOrThrow(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order not found with id " + id));
    }

    private OrderResponse toResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .status(order.getStatus().name())
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress())
                .items(order.getItems().stream()
                        .map(i -> OrderItemResponse.builder()
                                .productId(i.getProductId())
                                .productName(i.getProductName())
                                .quantity(i.getQuantity())
                                .unitPrice(i.getUnitPrice())
                                .build())
                        .toList())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
