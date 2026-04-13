package com.ctgroup.dto.request;

import com.ctgroup.entity.enums.OrderStatus;
import com.ctgroup.entity.enums.PaymentMethod;
import com.ctgroup.entity.enums.PaymentStatus;
import jakarta.validation.constraints.*;
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
public class OrderRequest {

    private String userId;

    private String customerName;

    private String customerPhone;

    private String customerEmail;

    private String customerAddress;

    private LocalDateTime deliveryTime;

    private String deliveryNote;

    private PaymentMethod paymentMethod;

    private String note;

    @NotEmpty(message = "Order items are required")
    private List<OrderItemRequest> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemRequest {
        @NotBlank(message = "Product ID is required")
        private String productId;

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;
    }
}
