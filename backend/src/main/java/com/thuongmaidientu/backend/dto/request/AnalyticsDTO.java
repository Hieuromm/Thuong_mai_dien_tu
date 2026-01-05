package com.thuongmaidientu.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDTO {
    private List<StatDetail> overview;
    private List<Double> chartData;
    private RealTimeDetail realTime; // Trường dữ liệu thời gian thực

    // ĐỊNH NGHĨA INNER CLASS TẠI ĐÂY
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RealTimeDetail {
        private Double salesToday;
        private long ordersCount;
        private int visits;
    }
}