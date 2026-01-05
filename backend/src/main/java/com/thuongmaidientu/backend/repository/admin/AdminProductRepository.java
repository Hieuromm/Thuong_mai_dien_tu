package com.thuongmaidientu.backend.repository.admin;

import com.thuongmaidientu.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AdminProductRepository extends JpaRepository<Product, Long> {

    // 1. Tìm sản phẩm theo khoảng thời gian tạo (Mới nhất lên đầu)
    // Dùng cho bộ lọc: Hôm nay, Hôm qua, 7 ngày...
    List<Product> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end);

    // 2. Đếm tổng sản phẩm toàn sàn (nếu cần cho thống kê dashboard)
    @Query("SELECT COUNT(p) FROM Product p")
    long countTotalProducts();
}