package com.thuongmaidientu.backend.repository;

import com.thuongmaidientu.backend.entity.Shop;
import com.thuongmaidientu.backend.entity.ShopStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {
    Optional<Shop> findByUserId(Long userId);


    boolean existsByShopName(String shopName);
    List<Shop> findByStatus(ShopStatus status);
}