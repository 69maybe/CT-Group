package com.ctgroup.controller;

import com.ctgroup.dto.response.ApiResponse;
import com.ctgroup.dto.response.DashboardStatsResponse;
import com.ctgroup.dto.response.OrderResponse;
import com.ctgroup.dto.response.ProductResponse;
import com.ctgroup.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getStats(
            @RequestParam(defaultValue = "week") String period) {
        DashboardStatsResponse response = dashboardService.getStats(period);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/recent-orders")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getRecentOrders(
            @RequestParam(defaultValue = "10") int limit) {
        List<OrderResponse> response = dashboardService.getRecentOrders(limit);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/top-products")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getTopProducts(
            @RequestParam(defaultValue = "10") int limit) {
        List<ProductResponse> response = dashboardService.getTopProducts(limit);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
