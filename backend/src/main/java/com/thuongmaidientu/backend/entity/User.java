package com.thuongmaidientu.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;
    private String fullName;
    private String avatarUrl;

    private String gender;
    private LocalDate birthday;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    // --- QUAN TRỌNG: Thêm 2 dòng này để chặn vòng lặp với class Shop ---
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Shop shop;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }



}