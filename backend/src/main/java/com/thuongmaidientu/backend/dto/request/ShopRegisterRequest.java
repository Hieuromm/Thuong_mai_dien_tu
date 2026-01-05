package com.thuongmaidientu.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ShopRegisterRequest {

    // Frontend gửi key "shopName" -> Backend hứng "shopName"
    @NotBlank(message = "Tên shop không được để trống")
    private String shopName;

    @NotBlank(message = "Địa chỉ không được để trống")
    private String address;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^[0-9]{10,11}$", message = "Số điện thoại phải là số và có 10-11 chữ số")
    private String phone;

    private String description;
}