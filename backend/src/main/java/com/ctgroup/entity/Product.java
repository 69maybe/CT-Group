package com.ctgroup.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_products_slug", columnList = "slug"),
    @Index(name = "idx_products_category_id", columnList = "category_id"),
    @Index(name = "idx_products_is_active", columnList = "is_active"),
    @Index(name = "idx_products_is_featured", columnList = "is_featured")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "short_desc")
    private String shortDesc;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal price;

    @Column(name = "compare_price", precision = 10, scale = 2)
    private BigDecimal comparePrice;

    @Column(unique = true)
    private String sku;

    private String barcode;

    private String image;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    @Builder.Default
    private Set<String> images = new HashSet<>();

    @Builder.Default
    @Column(name = "stock")
    private Integer stock = 0;

    @Builder.Default
    @Column(name = "unit")
    private String unit = "phần";

    private Integer calories;

    private String weight;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;

    @Builder.Default
    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @Builder.Default
    @Column(name = "is_best_seller")
    private Boolean isBestSeller = false;

    @Column(name = "meta_title")
    private String metaTitle;

    @Column(name = "meta_desc", columnDefinition = "TEXT")
    private String metaDesc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "product")
    @Builder.Default
    private Set<OrderItem> orderItems = new HashSet<>();
}
