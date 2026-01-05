package com.thuongmaidientu.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "shop_id", nullable = false)
    //@JsonIgnore
    private Shop shop;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Double price;
    private Integer stock;
    private String category;
    @Column(name = "image_url")
    private String imageUrl;

    private Double weight;

    private boolean isHidden;
    private boolean hasVariants;

    private String variant1Name;
    private String variant2Name;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ProductStatus status;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductImage> images;
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductVariant> variants;
}