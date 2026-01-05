package com.thuongmaidientu.backend.repository;

import com.thuongmaidientu.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Product, Long> {

    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.category IS NOT NULL")
    List<String> findDistinctCategories();
}