package com.thuongmaidientu.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "shops")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    // --- QUAN TRỌNG: Thêm 2 dòng này để chặn vòng lặp hashCode/toString ---
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private User user;

    @JsonProperty("name")
    @Column(name = "shop_name", nullable = false)
    private String shopName;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String logoUrl;
    private String coverUrl;

    private String address;
    private String phone;

    private Double rating;
    private int followerCount;
    private boolean isOfficial;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (rating == null) rating = 0.0;
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ShopStatus status;
}