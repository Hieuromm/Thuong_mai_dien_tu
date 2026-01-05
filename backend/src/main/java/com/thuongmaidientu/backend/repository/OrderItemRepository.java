package com.thuongmaidientu.backend.repository;

import com.thuongmaidientu.backend.dto.projection.ProductAnalyticsProjection;
import com.thuongmaidientu.backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query(value = "SELECT " +
            "oi.product_id as productId, " +
            "p.name as productName, " +
            "p.image_url as productImage, " +
            "SUM(oi.quantity) as soldCount, " + // Tổng bán theo thời gian
            "SUM(oi.price * oi.quantity) as revenue, " + // Doanh thu theo thời gian
            "(SELECT COUNT(*) FROM shop_visits sv " +
            " WHERE sv.product_id = oi.product_id " +
            " AND sv.created_at BETWEEN :startDate AND :endDate) as visitCount " + // Lượt xem theo thời gian
            "FROM order_items oi " +
            "JOIN orders o ON oi.order_id = o.id " +
            "JOIN products p ON oi.product_id = p.id " +
            "WHERE o.shop_id = :shopId " +
            "AND o.status = 'COMPLETED' " +
            "AND o.created_at BETWEEN :startDate AND :endDate " + // Lọc đơn hàng theo thời gian
            "GROUP BY oi.product_id, p.name, p.image_url", nativeQuery = true)
    List<ProductAnalyticsProjection> getProductAnalytics(
            @Param("shopId") Long shopId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}