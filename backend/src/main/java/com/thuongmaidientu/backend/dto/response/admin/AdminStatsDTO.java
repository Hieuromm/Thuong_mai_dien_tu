package com.thuongmaidientu.backend.dto.response.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminStatsDTO {
    private long totalUsers;
    private long totalShops;
    private long totalOrders;
    private double totalRevenue;
    private Map<String, Long> userDistribution;
}