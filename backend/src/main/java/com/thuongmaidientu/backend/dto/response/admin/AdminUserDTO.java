package com.thuongmaidientu.backend.dto.response.admin;

import com.thuongmaidientu.backend.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminUserDTO {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String avatarUrl;
    private Role role;
    private String gender;
    private LocalDateTime createdAt;
}