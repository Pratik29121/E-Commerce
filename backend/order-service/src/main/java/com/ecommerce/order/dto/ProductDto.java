package com.ecommerce.order.dto;

import lombok.Data;

import java.math.BigDecimal;

/** Mirrors the subset of product-service's ProductResponse that order-service needs. */
@Data
public class ProductDto {
    private Long id;
    private String name;
    private BigDecimal price;
    private Integer stockQuantity;
}
