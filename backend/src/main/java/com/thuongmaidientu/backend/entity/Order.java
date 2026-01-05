package com.thuongmaidientu.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order { // Tên class là Order -> File phải là Order.java
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private double totalAmount;
    private String shippingAddress;
    private String paymentMethod;
    private String note;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;

    private LocalDateTime createdAt;
    @Column(columnDefinition = "boolean default false")
    private boolean isPaid;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = OrderStatus.PENDING;
    }
}

