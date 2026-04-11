package com.greenlife.dto.response;

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
public class ProductResponse {

    private String id;

    private String name;

    private String slug;

    private String description;

    private String shortDesc;

    private BigDecimal price;

    private BigDecimal comparePrice;

    private String sku;

    private String barcode;

    private String image;

    private Set<String> images;

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

    private String categoryName;

    private java.time.LocalDateTime createdAt;

    private java.time.LocalDateTime updatedAt;
}
