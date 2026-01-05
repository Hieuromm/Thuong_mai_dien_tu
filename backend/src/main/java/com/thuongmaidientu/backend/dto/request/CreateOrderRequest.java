package com.thuongmaidientu.backend.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {
    private String address;
    private String paymentMethod;
    private String note;
    private List<Long> selectedCartItemIds;
}