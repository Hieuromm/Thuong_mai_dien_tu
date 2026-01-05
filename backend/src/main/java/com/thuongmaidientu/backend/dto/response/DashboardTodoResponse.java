package com.thuongmaidientu.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class DashboardTodoResponse {
    private long pendingCount;
    private long readyToShipCount;
    private long shippingCount;
    private long cancelledCount;
    private long completedCount;
}

