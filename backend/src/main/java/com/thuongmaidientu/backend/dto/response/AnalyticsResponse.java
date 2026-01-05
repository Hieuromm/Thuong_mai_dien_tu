package com.thuongmaidientu.backend.dto.response;


import com.thuongmaidientu.backend.dto.projection.ProductAnalyticsProjection;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class AnalyticsResponse {
    private List<Map<String, Object>> overview;
    private List<ProductAnalyticsProjection> products;
    private List<Double> chartData;
}