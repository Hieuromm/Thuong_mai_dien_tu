package com.thuongmaidientu.backend.repository.admin;

import com.thuongmaidientu.backend.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AdminShopRepository extends JpaRepository<Shop, Long> {

    // 1. Đếm số lượng Shop đăng ký mới theo khoảng thời gian
    // Dùng cho bộ lọc: Hôm nay, Hôm qua, Tháng này...
    @Query("SELECT COUNT(s) FROM Shop s WHERE s.createdAt BETWEEN :start AND :end")
    long countShopsByDate(LocalDateTime start, LocalDateTime end);

    // 2. Đếm tổng số Shop toàn hệ thống
    @Query("SELECT COUNT(s) FROM Shop s")
    long countTotalShops();

    // 3. Tìm tất cả Shop đăng ký trong khoảng thời gian
    List<Shop> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end);
}