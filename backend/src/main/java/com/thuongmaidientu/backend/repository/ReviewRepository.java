package com.thuongmaidientu.backend.repository;

import com.thuongmaidientu.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // 1. Tìm danh sách đánh giá của một sản phẩm (Sắp xếp mới nhất lên đầu)
    // Dùng để hiển thị ở trang Chi tiết sản phẩm
    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);


    // 2. Tìm các đánh giá của một người dùng cụ thể
    List<Review> findByUserId(Long userId);

    // 3. Tìm các đánh giá thuộc về một Shop (Thông qua bảng Product)
    // Dùng cho trang Quản lý đánh giá của người bán
    List<Review> findByProduct_ShopIdOrderByCreatedAtDesc(Long shopId);
}