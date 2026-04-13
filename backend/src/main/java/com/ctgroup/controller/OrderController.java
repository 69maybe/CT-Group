package com.ctgroup.controller;

import com.ctgroup.dto.request.OrderRequest;
import com.ctgroup.dto.response.ApiResponse;
import com.ctgroup.dto.response.OrderResponse;
import com.ctgroup.dto.response.PageResponse;
import com.ctgroup.security.UserPrincipal;
import com.ctgroup.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getOrders(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) String status) {

        PageResponse<OrderResponse> response = orderService.getOrders(
                currentUser.getId(), page, limit, status);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrder(@PathVariable String id) {
        OrderResponse response = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderByNumber(@PathVariable String orderNumber) {
        OrderResponse response = orderService.getOrderByOrderNumber(orderNumber);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody OrderRequest request) {

        String userId = currentUser != null ? currentUser.getId() : null;
        OrderResponse response = orderService.createOrder(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Order created successfully", response));
    }
}
