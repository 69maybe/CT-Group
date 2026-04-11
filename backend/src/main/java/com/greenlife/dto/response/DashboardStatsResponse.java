package com.greenlife.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {

    private long totalOrders;

    private long pendingOrders;

    private long completedOrders;

    private long cancelledOrders;

    private BigDecimal totalRevenue;

    private BigDecimal todayRevenue;

    private BigDecimal weekRevenue;

    private BigDecimal monthRevenue;

    private long totalProducts;

    private long totalUsers;

    private long lowStockProducts;
}
