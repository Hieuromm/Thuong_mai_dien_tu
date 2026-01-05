package com.thuongmaidientu.backend.service.admin;

import com.thuongmaidientu.backend.dto.response.admin.AdminOrderResponse;
import com.thuongmaidientu.backend.entity.Order;
import com.thuongmaidientu.backend.repository.admin.AdminOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminOrderService {

    private final AdminOrderRepository adminOrderRepository;

    public List<AdminOrderResponse> getAllOrders(String range) {
        LocalDateTime end = LocalDateTime.now();
        LocalDateTime start;

        // Logic lọc ngày (Tương tự các service khác)
        switch (range) {
            case "today":
                start = LocalDate.now().atStartOfDay();
                break;
            case "yesterday":
                start = LocalDate.now().minusDays(1).atStartOfDay();
                end = LocalDate.now().atStartOfDay();
                break;
            case "7days":
                start = LocalDateTime.now().minusDays(7);
                break;
            case "month":
                start = LocalDate.now().withDayOfMonth(1).atStartOfDay();
                break;
            case "last_month":
                start = LocalDate.now().minusMonths(1).withDayOfMonth(1).atStartOfDay();
                end = LocalDate.now().withDayOfMonth(1).atStartOfDay();
                break;
            default: // "all"
                start = LocalDateTime.of(2000, 1, 1, 0, 0);
                break;
        }

        List<Order> orders = adminOrderRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(start, end);

        return orders.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private AdminOrderResponse mapToDTO(Order order) {
        return AdminOrderResponse.builder()
                .id(order.getId())
                .customerName(order.getUser() != null ? order.getUser().getFullName() : "Khách lẻ")
                .shopName(order.getShop() != null ? order.getShop().getShopName() : "Shop ẩn")
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .paymentMethod(order.getPaymentMethod())
                .createdAt(order.getCreatedAt().toString())
                .build();
    }
}