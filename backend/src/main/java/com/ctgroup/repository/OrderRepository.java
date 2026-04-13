package com.ctgroup.repository;

import com.ctgroup.entity.Order;
import com.ctgroup.entity.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String>, JpaSpecificationExecutor<Order> {

    Optional<Order> findByOrderNumber(String orderNumber);

    Page<Order> findByUserId(String userId, Pageable pageable);

    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    @Query("SELECT o FROM Order o WHERE o.createdAt >= :startDate AND o.createdAt <= :endDate")
    List<Order> findOrdersBetweenDates(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    long countByStatus(OrderStatus status);

    @Query("SELECT SUM(o.total) FROM Order o WHERE o.status = 'DELIVERED' AND o.createdAt >= :startDate AND o.createdAt <= :endDate")
    java.math.BigDecimal sumRevenueBetweenDates(LocalDateTime startDate, LocalDateTime endDate);
}
