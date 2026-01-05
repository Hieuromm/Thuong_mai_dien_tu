package com.thuongmaidientu.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String message;

    private String type;
    private Long referenceId;

    private boolean isRead = false;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // Người nhận thông báo

    @CreationTimestamp
    private LocalDateTime createdAt;
}