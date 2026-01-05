package com.thuongmaidientu.backend.controller;

import com.thuongmaidientu.backend.dto.projection.ProductAnalyticsProjection;
import com.thuongmaidientu.backend.dto.response.AnalyticsResponse;
import com.thuongmaidientu.backend.dto.response.DashboardTodoResponse; // Bạn cần tạo DTO này
import com.thuongmaidientu.backend.entity.User;
import com.thuongmaidientu.backend.repository.UserRepository;
import com.thuongmaidientu.backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seller/analytics")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:5173")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final UserRepository userRepository;

    /**
     * 1. Lấy thống kê "Danh sách cần làm" (Đơn chờ xử lý, Chờ giao hàng, v.v.)
     * Dùng để hiển thị các con số thực tế thay vì số "12" giả lập
     */
    @GetMapping("/todo-statistics")
    public ResponseEntity<DashboardTodoResponse> getTodoStatistics(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long shopId = user.getShop().getId();

        // Gọi service để đếm số lượng đơn hàng theo từng trạng thái trong DB
        return ResponseEntity.ok(analyticsService.getTodoStatistics(shopId));
    }

    /**
     * 2. Lấy dữ liệu tổng quan (Doanh số, Đơn hàng, Biểu đồ)
     */
    @GetMapping("/overview")
    public ResponseEntity<?> getOverview(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "today") String range
    ) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long shopId = user.getShop().getId();
        return ResponseEntity.ok(analyticsService.getOverview(shopId, range));
    }

    /**
     * 3. Lấy phân tích chi tiết từng sản phẩm
     */
    @GetMapping("/products")
    public ResponseEntity<List<ProductAnalyticsProjection>> getProductAnalytics(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "7days") String range
    ) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long shopId = user.getShop().getId();
        List<ProductAnalyticsProjection> productStats = analyticsService.getProductStats(shopId, range);

        return ResponseEntity.ok(productStats);
    }
}