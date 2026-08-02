package com.ecommerce.product.service;

import com.ecommerce.product.dto.ProductRequest;
import com.ecommerce.product.dto.ProductResponse;
import com.ecommerce.product.exception.InsufficientStockException;
import com.ecommerce.product.exception.NotFoundException;
import com.ecommerce.product.model.Product;
import com.ecommerce.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public Page<ProductResponse> search(String keyword, String category, Pageable pageable) {
        return productRepository.search(
                (keyword == null || keyword.isBlank()) ? null : keyword,
                (category == null || category.isBlank()) ? null : category,
                pageable
        ).map(this::toResponse);
    }

    public ProductResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    public ProductResponse create(ProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .imageUrl(request.getImageUrl())
                .stockQuantity(request.getStockQuantity())
                .build();
        return toResponse(productRepository.save(product));
    }

    public ProductResponse update(Long id, ProductRequest request) {
        Product product = findOrThrow(id);
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        product.setStockQuantity(request.getStockQuantity());
        return toResponse(productRepository.save(product));
    }

    public void delete(Long id) {
        Product product = findOrThrow(id);
        productRepository.delete(product);
    }

    /** Called by order-service when an order is placed, to atomically reserve stock. */
    @Transactional
    public ProductResponse decreaseStock(Long id, int quantity) {
        Product product = findOrThrow(id);
        if (product.getStockQuantity() < quantity) {
            throw new InsufficientStockException(
                    "Not enough stock for '" + product.getName() + "'. Available: " + product.getStockQuantity());
        }
        product.setStockQuantity(product.getStockQuantity() - quantity);
        return toResponse(productRepository.save(product));
    }

    private Product findOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found with id " + id));
    }

    private ProductResponse toResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .category(product.getCategory())
                .imageUrl(product.getImageUrl())
                .stockQuantity(product.getStockQuantity())
                .build();
    }
}
