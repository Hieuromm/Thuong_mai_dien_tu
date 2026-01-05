package com.thuongmaidientu.backend.dto.response.admin;

import com.thuongmaidientu.backend.entity.ProductStatus;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class AdminProductDTO {
    private Long id;
    private String name;
    private Double price;
    private Integer stock;
    private String imageUrl;
    private ProductStatus status;
    private String shopName;
    private Long shopId;
    private String createdAt;
}