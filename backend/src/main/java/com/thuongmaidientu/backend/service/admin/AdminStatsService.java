package com.thuongmaidientu.backend.service.admin;

import com.thuongmaidientu.backend.dto.response.admin.AdminStatsDTO;
import com.thuongmaidientu.backend.entity.Role;
// Import trọn bộ 3 Repository của Admin
import com.thuongmaidientu.backend.repository.admin.AdminOrderRepository;
import com.thuongmaidientu.backend.repository.admin.AdminShopRepository; // <--- Mới
import com.thuongmaidientu.backend.repository.admin.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminStatsService {

    // Inject 3 Repository chuyên biệt cho Admin
    private final AdminUserRepository adminUserRepository;
    private final AdminOrderRepository adminOrderRepository;
    private final AdminShopRepository adminShopRepository; // <--- Thay cho ShopRepository cũ

    public AdminStatsDTO getDashboardStats(String range) {
        LocalDateTime end = LocalDateTime.now();
        LocalDateTime start;

        // Logic xử lý thời gian (Giữ nguyên như cũ)
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

        // 1. Query DB (Dùng các Repository Admin)
        long totalUsers = adminUserRepository.countUsersByDate(start, end);

        // Sử dụng AdminShopRepository vừa tạo
        long totalShops = adminShopRepository.countShopsByDate(start, end);

        long totalOrders = adminOrderRepository.countOrdersByDate(start, end);
        double totalRevenue = adminOrderRepository.sumRevenueByDate(start, end);

        // 2. Tính phân bổ Role
        long buyers = adminUserRepository.countByRoleAndDate(Role.BUYER, start, end);
        long sellers = adminUserRepository.countByRoleAndDate(Role.SELLER, start, end);
        long admins = adminUserRepository.countByRoleAndDate(Role.ADMIN, start, end);

        return AdminStatsDTO.builder()
                .totalUsers(totalUsers)
                .totalShops(totalShops)
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .userDistribution(Map.of(
                        "BUYER", buyers,
                        "SELLER", sellers,
                        "ADMIN", admins
                ))
                .build();
    }
}