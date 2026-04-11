package com.greenlife.repository;

import com.greenlife.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, String> {

    List<OrderItem> findByOrderId(String orderId);

    @Query("SELECT oi.product.id, SUM(oi.quantity) as totalQty FROM OrderItem oi GROUP BY oi.product.id ORDER BY totalQty DESC")
    List<Object[]> findTopSellingProducts();
}
