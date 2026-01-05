package com.thuongmaidientu.backend.repository;

import com.thuongmaidientu.backend.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    List<ProductVariant> findByProductId(Long productId);
    // 👇 THÊM HÀM NÀY ĐỂ TÌM BIẾN THỂ KHI TRỪ KHO
    Optional<ProductVariant> findByProductIdAndValue1AndValue2(Long productId, String value1, String value2);

    // Tìm trường hợp chỉ có 1 nhóm phân loại (Value2 là null)
    Optional<ProductVariant> findByProductIdAndValue1(Long productId, String value1);
}