package com.thuongmaidientu.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductPublicResponse {
    private Long id;
    private String name;
    private String image;
    private Double price;
    private int discount;
    private int sold;
    private Double originalPrice;
    private boolean isMall;
    private Long shopId;
}