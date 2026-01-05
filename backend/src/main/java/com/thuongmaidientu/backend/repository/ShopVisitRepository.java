package com.thuongmaidientu.backend.repository;

import com.thuongmaidientu.backend.entity.ShopVisit;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ShopVisitRepository extends JpaRepository<ShopVisit, Long> {

    @Query("SELECT COUNT(v) FROM ShopVisit v WHERE v.shop.id = :shopId " +
            "AND v.createdAt BETWEEN :start AND :end")
    long countByShopAndDate(Long shopId, LocalDateTime start, LocalDateTime end);


    @Query("SELECT v.productId FROM ShopVisit v GROUP BY v.productId ORDER BY COUNT(v) DESC")
    List<Long> findTopVisitedProductIds(Pageable pageable);

    // Nâng cao: Lấy Top trong 7 ngày gần đây
    @Query("SELECT v.productId FROM ShopVisit v WHERE v.createdAt > :since GROUP BY v.productId ORDER BY COUNT(v) DESC")
    List<Long> findTrendingProductIds(@Param("since") LocalDateTime since, Pageable pageable);
}