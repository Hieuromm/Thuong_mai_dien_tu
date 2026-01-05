package com.thuongmaidientu.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bank_accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore // Tránh vòng lặp vô hạn khi trả về JSON
    private User user;

    private String bankName;      // Tên ngân hàng (Vietcombank, MB...)
    private String accountNumber; // Số tài khoản
    private String accountName;   // Tên chủ tài khoản
    private String branch;        // Chi nhánh

    private boolean isDefault;    // Là tài khoản mặc định
    private boolean isVerified;   // Đã kiểm tra chưa (Mô phỏng)
}