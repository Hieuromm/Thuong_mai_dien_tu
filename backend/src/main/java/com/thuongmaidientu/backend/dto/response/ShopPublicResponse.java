package com.thuongmaidientu.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ShopPublicResponse {
    private Long id;
    private String name;
    private String avatar;
    private String cover;
    private boolean isOfficial;
    private Double rating;
    private int followerCount;
    private int totalProducts;
    private String joinDate;
    private String description;
}