package com.ecommerce.product.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StockAdjustRequest {
    @NotNull
    private Integer quantity;
}
