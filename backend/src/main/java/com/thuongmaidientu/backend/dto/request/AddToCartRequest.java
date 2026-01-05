package com.thuongmaidientu.backend.dto.request;

import lombok.Data;

@Data
public class AddToCartRequest {
    private Long productId;
    private int quantity;
    private String variant1; // VD: Màu
    private String variant2; // VD: Size
}