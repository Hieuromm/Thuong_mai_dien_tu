package com.thuongmaidientu.backend.repository;

import com.thuongmaidientu.backend.entity.Product;
import com.thuongmaidientu.backend.entity.ShopVisit;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProductVisitRepository extends JpaRepository<ShopVisit, Long> {

    @Query("SELECT p FROM Product p " +
            "JOIN ShopVisit v ON p.id = v.productId " +
            "WHERE v.createdAt >= :startDate " +
            "GROUP BY p " +
            "ORDER BY COUNT(v.id) DESC")
    List<Product> findTrendingProducts(@Param("startDate") LocalDateTime startDate, Pageable pageable);
}