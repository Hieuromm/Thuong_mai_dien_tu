package com.thuongmaidientu.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private String category;
    private String imageUrl;

    // --- BỔ SUNG DÒNG NÀY ---
    private Double weight;
    // ------------------------

    @JsonProperty("isHidden")
    private boolean isHidden;

    private Double price;
    private Integer stock;

    // Các trường biến thể
    private String variant1Name;
    private String variant2Name;
    private List<ProductVariantRequest> variants;

    @Data
    public static class ProductVariantRequest {
        private String value1;
        private String value2;
        private Double price;
        private Integer stock;
    }
}