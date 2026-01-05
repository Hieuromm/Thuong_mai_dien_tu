package com.thuongmaidientu.backend.repository.admin;

import com.thuongmaidientu.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AdminOrderRepository extends JpaRepository<Order, Long> {
    // Tổng doanh thu theo thời gian
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status = 'COMPLETED' AND o.createdAt BETWEEN :start AND :end")
    Double sumRevenueByDate(LocalDateTime start, LocalDateTime end);
    // Tổng đơn hàng theo thời gian
    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt BETWEEN :start AND :end")
    long countOrdersByDate(LocalDateTime start, LocalDateTime end);
    // Lấy danh sách đơn hàng theo ngày
    List<Order> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end);
}