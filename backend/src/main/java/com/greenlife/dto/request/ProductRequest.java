package com.greenlife.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 200, message = "Name must be between 2 and 200 characters")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    private String shortDesc;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    private BigDecimal comparePrice;

    private String sku;

    private String barcode;

    private String image;

    private Set<String> images;

    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;

    private String unit;

    private Integer calories;

    private String weight;

    private Boolean isActive;

    private Boolean isFeatured;

    private Boolean isBestSeller;

    private String metaTitle;

    private String metaDesc;

    private String categoryId;
}
