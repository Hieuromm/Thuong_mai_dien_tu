package com.thuongmaidientu.backend.dto.response.admin;

import com.thuongmaidientu.backend.entity.OrderStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminOrderResponse {
    private Long id;
    private String customerName;
    private String shopName;
    private Double totalAmount;
    private OrderStatus status;
    private String paymentMethod;
    private String createdAt;
}