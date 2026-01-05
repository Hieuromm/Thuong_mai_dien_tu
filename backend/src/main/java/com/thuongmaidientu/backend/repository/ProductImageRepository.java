package com.thuongmaidientu.backend.repository;

import com.thuongmaidientu.backend.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findByProductId(Long productId);
    void deleteByProductId(Long productId); // Dùng khi cập nhật sản phẩm
}