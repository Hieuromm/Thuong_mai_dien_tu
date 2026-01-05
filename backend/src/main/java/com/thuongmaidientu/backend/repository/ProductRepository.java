package com.thuongmaidientu.backend.repository;

import com.thuongmaidientu.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    @EntityGraph(attributePaths = {"variants"})
    List<Product> findByShopId(Long shopId);
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) AND p.isHidden = false")
    List<Product> searchByName(@Param("keyword") String keyword);
    @EntityGraph(attributePaths = {"variants", "images", "shop"})
    Optional<Product> findById(Long id);
    // Tìm sản phẩm theo Shop ID và KHÔNG bị ẩn
    Page<Product> findByShopIdAndIsHiddenFalse(Long shopId, Pageable pageable);

    // Đếm tổng sản phẩm hiển thị của shop
    int countByShopIdAndIsHiddenFalse(Long shopId);
    @Query("SELECT p FROM Product p WHERE " +
            "(:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:categories IS NULL OR p.category IN :categories) AND " +
            "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
            "p.isHidden = false")
    List<Product> searchProductsWithFilters(
            @Param("keyword") String keyword,
            @Param("categories") List<String> categories,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            Sort sort);
    List<Product> findByCategory(String category);
}