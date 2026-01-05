package com.thuongmaidientu.backend.service.admin;

import com.thuongmaidientu.backend.entity.Shop;
import com.thuongmaidientu.backend.entity.ShopStatus;
import com.thuongmaidientu.backend.repository.admin.AdminShopRepository;
import com.thuongmaidientu.backend.service.Notification.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminShopService {

    // Inject AdminShopRepository (đã tạo ở bước trước)
    private final AdminShopRepository adminShopRepository;
    private final NotificationService notificationService;

    public List<Shop> getAllShops(String range) {
        LocalDateTime end = LocalDateTime.now();
        LocalDateTime start;

        // 1. Logic xác định thời gian (Giống AdminUserService)
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
            default: // "all" hoặc null
                start = LocalDateTime.of(2000, 1, 1, 0, 0);
                break;
        }

        // 2. Gọi Repository để tìm kiếm
        return adminShopRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(start, end);
    }

    @Transactional
    public Shop approveShop(Long shopId) {
        Shop shop = adminShopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Shop với ID: " + shopId));

        shop.setStatus(ShopStatus.ACTIVE);

        notificationService.createNotification(
                shop.getUser(),
                "Cửa hàng được phê duyệt!",
                "Chúc mừng! Cửa hàng " + shop.getShopName() + " của bạn đã được duyệt và có thể bắt đầu bán.",
                "SHOP",
                shop.getId()
        );
        return adminShopRepository.save(shop);
    }

    @Transactional
    public Shop rejectShop(Long shopId) {
        Shop shop = adminShopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Shop với ID: " + shopId));

        shop.setStatus(ShopStatus.REJECTED);
        return adminShopRepository.save(shop);
    }
}