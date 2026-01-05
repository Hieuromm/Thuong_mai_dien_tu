package com.thuongmaidientu.backend.repository;

import com.thuongmaidientu.backend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    void deleteByCartId(Long cartId);
}