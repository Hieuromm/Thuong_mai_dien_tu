package com.thuongmaidientu.backend.repository;

import com.thuongmaidientu.backend.entity.Order;
import com.thuongmaidientu.backend.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository; // <--- BẠN THIẾU DÒNG NÀY
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // 1. Lấy danh sách đơn hàng của Người mua (Sắp xếp mới nhất lên đầu)
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    // 2. Lấy danh sách đơn hàng của Shop (Người bán)
    List<Order> findByShopIdOrderByCreatedAtDesc(Long shopId);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.shop.id = :shopId " +
            "AND o.status = 'COMPLETED' AND o.createdAt BETWEEN :start AND :end")
    Double sumRevenueByShop(Long shopId, LocalDateTime start, LocalDateTime end);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.shop.id = :shopId " +
            "AND o.status = 'COMPLETED' AND o.createdAt BETWEEN :start AND :end")
    long countOrdersByShop(Long shopId, LocalDateTime start, LocalDateTime end);

    @Query("SELECT HOUR(o.createdAt), SUM(o.totalAmount) FROM Order o " +
            "WHERE o.shop.id = :shopId AND o.status = 'COMPLETED' " +
            "AND o.createdAt BETWEEN :start AND :end GROUP BY HOUR(o.createdAt)")
    List<Object[]> getHourlyRevenue(Long shopId, LocalDateTime start, LocalDateTime end);
    long countByShopIdAndStatus(Long shopId, OrderStatus status);
    @Query("SELECT COUNT(DISTINCT o.user.id) FROM Order o WHERE o.shop.id = :shopId AND o.createdAt BETWEEN :start AND :end")
    long countDistinctBuyersByShop(Long shopId, LocalDateTime start, LocalDateTime end);

    // Đếm đơn hàng theo trạng thái và thời gian
    @Query("SELECT COUNT(o) FROM Order o WHERE o.shop.id = :shopId AND o.status = :status AND o.createdAt BETWEEN :start AND :end")
    long countByShopIdAndStatusAndDate(Long shopId, OrderStatus status, LocalDateTime start, LocalDateTime end);
}