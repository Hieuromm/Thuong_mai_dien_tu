package com.thuongmaidientu.backend.dto.projection;

public interface ProductAnalyticsProjection {
    Long getProductId();
    String getProductName();
    String getProductImage();
    Long getSoldCount();
    Double getRevenue();
    Long getVisitCount();
}