package com.thuongmaidientu.backend.service.admin;

import com.thuongmaidientu.backend.dto.response.admin.AdminProductDTO;
import com.thuongmaidientu.backend.entity.Product;
import com.thuongmaidientu.backend.entity.ProductStatus;
// Import Repository Admin mới
import com.thuongmaidientu.backend.entity.User;
import com.thuongmaidientu.backend.repository.admin.AdminProductRepository;
import com.thuongmaidientu.backend.service.Notification.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminProductService {

    // Inject AdminProductRepository thay vì ProductRepository gốc
    private final AdminProductRepository adminProductRepository;
    private final NotificationService notificationService;

    public List<AdminProductDTO> getAllProducts(String range) {
        LocalDateTime end = LocalDateTime.now();
        LocalDateTime start;

        // 1. Logic xác định khoảng thời gian
        switch (range) {
            case "today":
                start = LocalDate.now().atStartOfDay(); // 00:00 hôm nay
                break;
            case "yesterday":
                start = LocalDate.now().minusDays(1).atStartOfDay();
                end = LocalDate.now().atStartOfDay(); // Đến 00:00 hôm nay
                break;
            case "7days":
                start = LocalDateTime.now().minusDays(7);
                break;
            case "month": // Tháng này
                start = LocalDate.now().withDayOfMonth(1).atStartOfDay();
                break;
            case "last_month": // Tháng trước
                start = LocalDate.now().minusMonths(1).withDayOfMonth(1).atStartOfDay();
                end = LocalDate.now().withDayOfMonth(1).atStartOfDay();
                break;
            default: // "all"
                start = LocalDateTime.of(2000, 1, 1, 0, 0);
                break;
        }

        // 2. Gọi Repository Admin để tìm kiếm
        List<Product> products = adminProductRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(start, end);

        // 3. Convert sang DTO
        return products.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateProductStatus(Long productId, ProductStatus newStatus) {
        Product product = adminProductRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        product.setStatus(newStatus);
        if (newStatus == ProductStatus.ACTIVE) {
            // Gửi thông báo cho chủ Shop sở hữu sản phẩm này
            User seller = product.getShop().getUser();
            notificationService.createNotification(
                    seller,
                    "Sản phẩm được duyệt",
                    "Sản phẩm '" + product.getName() + "' đã được duyệt bán công khai.",
                    "PRODUCT",
                    product.getId()
            );
        } else if (newStatus == ProductStatus.REJECTED) {
            // Gửi thông báo từ chối
            User seller = product.getShop().getUser();
            notificationService.createNotification(
                    seller,
                    "Sản phẩm bị từ chối",
                    "Sản phẩm '" + product.getName() + "' vi phạm chính sách.",
                    "PRODUCT",
                    product.getId()
            );
        }
        adminProductRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long productId) {
        if (!adminProductRepository.existsById(productId)) {
            throw new RuntimeException("Sản phẩm không tồn tại");
        }
        adminProductRepository.deleteById(productId);
    }

    private AdminProductDTO mapToDTO(Product p) {
        return AdminProductDTO.builder()
                .id(p.getId())
                .name(p.getName())
                .price(p.getPrice())
                .stock(p.getStock())
                .imageUrl(p.getImageUrl() != null ? p.getImageUrl() : "")
                .status(p.getStatus())
                // Lưu ý: Kiểm tra null an toàn cho Shop
                .shopName(p.getShop() != null ? p.getShop().getShopName() : "Unknown Shop")
                .shopId(p.getShop() != null ? p.getShop().getId() : null)
                .createdAt(p.getCreatedAt() != null ? p.getCreatedAt().toString() : "")
                .build();
    }
}