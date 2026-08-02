package com.ecommerce.order.client;

import com.ecommerce.order.dto.ProductDto;
import com.ecommerce.order.exception.OrderProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class ProductClient {

    private final RestTemplate restTemplate;

    @Value("${services.product-service.url}")
    private String productServiceUrl;

    public ProductDto getProduct(Long productId) {
        try {
            return restTemplate.getForObject(productServiceUrl + "/api/products/{id}", ProductDto.class, productId);
        } catch (HttpClientErrorException.NotFound e) {
            throw new OrderProcessingException("Product " + productId + " does not exist");
        } catch (ResourceAccessException e) {
            throw new OrderProcessingException("product-service is unavailable, please try again shortly");
        }
    }

    /** Atomically decrements stock on product-service. Throws if there isn't enough stock. */
    public void decreaseStock(Long productId, int quantity) {
        try {
            restTemplate.postForObject(
                    productServiceUrl + "/api/products/{id}/decrease-stock",
                    Map.of("quantity", quantity),
                    Void.class,
                    productId);
        } catch (HttpClientErrorException.Conflict e) {
            throw new OrderProcessingException("Not enough stock available for product " + productId);
        } catch (HttpServerErrorException | ResourceAccessException e) {
            throw new OrderProcessingException("product-service is unavailable, please try again shortly");
        }
    }
}
