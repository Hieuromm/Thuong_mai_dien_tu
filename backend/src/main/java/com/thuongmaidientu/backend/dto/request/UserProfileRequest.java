package com.thuongmaidientu.backend.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UserProfileRequest {
    private String fullName;
    private String phone;
    private String gender;
    private LocalDate birthday;
    private String avatarUrl;
}