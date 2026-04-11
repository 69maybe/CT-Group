package com.greenlife.entity;

import com.greenlife.entity.enums.OrderStatus;
import com.greenlife.entity.enums.PaymentMethod;
import com.greenlife.entity.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "orders", indexes = {
    @Index(name = "idx_orders_order_number", columnList = "order_number"),
    @Index(name = "idx_orders_user_id", columnList = "user_id"),
    @Index(name = "idx_orders_status", columnList = "status"),
    @Index(name = "idx_orders_created_at", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order extends BaseEntity {

    @Column(name = "order_number", unique = true, nullable = false)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "status")
    private OrderStatus status = OrderStatus.PENDING;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal subtotal;

    @Builder.Default
    @Column(precision = 10, scale = 2)
    private BigDecimal discount = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "shipping_fee", precision = 10, scale = 2)
    private BigDecimal shippingFee = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal total;

    // Customer info for guest orders
    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "customer_phone")
    private String customerPhone;

    @Column(name = "customer_email")
    private String customerEmail;

    @Column(name = "customer_address", columnDefinition = "TEXT")
    private String customerAddress;

    // Delivery
    @Column(name = "delivery_time")
    private java.time.LocalDateTime deliveryTime;

    @Column(name = "delivery_note", columnDefinition = "TEXT")
    private String deliveryNote;

    // Payment
    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod = PaymentMethod.COD;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    // Notes
    @Column(columnDefinition = "TEXT")
    private String note;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<OrderItem> items = new HashSet<>();
}
