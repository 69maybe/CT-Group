package com.ctgroup.service;

import com.ctgroup.dto.response.DashboardStatsResponse;
import com.ctgroup.dto.response.OrderResponse;
import com.ctgroup.dto.response.ProductResponse;
import com.ctgroup.entity.enums.OrderStatus;
import com.ctgroup.repository.OrderItemRepository;
import com.ctgroup.repository.OrderRepository;
import com.ctgroup.repository.ProductRepository;
import com.ctgroup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderService orderService;
    private final ProductService productService;

    @Transactional(readOnly = true)
    public DashboardStatsResponse getStats(String period) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfDay = now.toLocalDate().atStartOfDay();
        LocalDateTime startOfWeek = now.minusDays(7).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime startOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);

        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING);
        long completedOrders = orderRepository.countByStatus(OrderStatus.DELIVERED);
        long cancelledOrders = orderRepository.countByStatus(OrderStatus.CANCELLED);

        BigDecimal totalRevenue = orderRepository.sumRevenueBetweenDates(
                now.minusYears(10), now) != null ? orderRepository.sumRevenueBetweenDates(now.minusYears(10), now) : BigDecimal.ZERO;
        BigDecimal todayRevenue = orderRepository.sumRevenueBetweenDates(startOfDay, now) != null ?
                orderRepository.sumRevenueBetweenDates(startOfDay, now) : BigDecimal.ZERO;
        BigDecimal weekRevenue = orderRepository.sumRevenueBetweenDates(startOfWeek, now) != null ?
                orderRepository.sumRevenueBetweenDates(startOfWeek, now) : BigDecimal.ZERO;
        BigDecimal monthRevenue = orderRepository.sumRevenueBetweenDates(startOfMonth, now) != null ?
                orderRepository.sumRevenueBetweenDates(startOfMonth, now) : BigDecimal.ZERO;

        long totalProducts = productRepository.count();
        long totalUsers = userRepository.count();

        List<ProductResponse> allProducts = productService.getProducts(null, null, null, null, null, null, null).getItems();
        long lowStockProducts = allProducts.stream()
                .filter(p -> p.getStock() != null && p.getStock() < 10)
                .count();

        return DashboardStatsResponse.builder()
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .completedOrders(completedOrders)
                .cancelledOrders(cancelledOrders)
                .totalRevenue(totalRevenue)
                .todayRevenue(todayRevenue)
                .weekRevenue(weekRevenue)
                .monthRevenue(monthRevenue)
                .totalProducts(totalProducts)
                .totalUsers(totalUsers)
                .lowStockProducts(lowStockProducts)
                .build();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getRecentOrders(int limit) {
        return orderService.getOrders(null, 1, limit, null).getItems();
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getTopProducts(int limit) {
        List<Object[]> topSelling = orderItemRepository.findTopSellingProducts();
        return topSelling.stream()
                .limit(limit)
                .map(result -> {
                    String productId = (String) result[0];
                    return productRepository.findById(productId)
                            .map(product -> ProductResponse.builder()
                                    .id(product.getId())
                                    .name(product.getName())
                                    .image(product.getImage())
                                    .price(product.getPrice())
                                    .stock(product.getStock())
                                    .build())
                            .orElse(null);
                })
                .filter(p -> p != null)
                .collect(Collectors.toList());
    }
}
