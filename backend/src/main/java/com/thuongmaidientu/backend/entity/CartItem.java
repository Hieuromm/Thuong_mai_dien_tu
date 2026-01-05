package com.thuongmaidientu.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    @JsonIgnore
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    // Lưu thông tin biến thể (nếu có)
    private String variant1; // Màu
    private String variant2; // Size

    private int quantity;
}