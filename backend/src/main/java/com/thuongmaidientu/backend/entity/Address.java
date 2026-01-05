package com.thuongmaidientu.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "addresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    private String name;        // Tên người nhận
    private String phone;       // Số điện thoại

    private String city;        // Tỉnh/Thành phố
    private String district;    // Quận/Huyện
    private String ward;        // Phường/Xã
    private String street;      // Địa chỉ cụ thể (Số nhà, đường...)

    private boolean isDefault;  // Địa chỉ mặc định
    private boolean isPickup;   // Địa chỉ lấy hàng (dành cho Seller)
}