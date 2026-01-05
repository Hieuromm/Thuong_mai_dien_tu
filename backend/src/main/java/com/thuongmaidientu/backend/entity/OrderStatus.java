package com.thuongmaidientu.backend.entity;

public enum OrderStatus {
    PENDING,    // Chờ xác nhận
    CONFIRMED,  // Đã xác nhận (Shop đang chuẩn bị hàng)
    SHIPPING,   // Đang giao hàng
    COMPLETED,  // Đã giao thành công
    CANCELLED, // Đã hủy
    DELIVERY_FAILED,    // Giao hàng thất bại (Khách bom hàng/không nghe máy)
    RETURN_REQUESTED,   // Yêu cầu Trả hàng/Hoàn tiền
    RETURNED,           // Đã trả hàng (Shop đồng ý)
    RETURN_REJECTED     // Shop từ chối trả hàng (Vẫn tính là COMPLETED)
}