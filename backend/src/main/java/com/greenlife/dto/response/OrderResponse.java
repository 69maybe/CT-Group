package com.greenlife.dto.response;

import com.greenlife.entity.enums.OrderStatus;
import com.greenlife.entity.enums.PaymentMethod;
import com.greenlife.entity.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private String id;

    private String orderNumber;

    private String userId;

    private String userName;

    private OrderStatus status;

    private BigDecimal subtotal;

    private BigDecimal discount;

    private BigDecimal shippingFee;

    private BigDecimal total;

    private String customerName;

    private String customerPhone;

    private String customerEmail;

    private String customerAddress;

    private LocalDateTime deliveryTime;

    private String deliveryNote;

    private PaymentMethod paymentMethod;

    private PaymentStatus paymentStatus;

    private String note;

    private List<OrderItemResponse> items;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
