package com.thuongmaidientu.backend.controller.admin;

import com.thuongmaidientu.backend.dto.response.admin.AdminStatsDTO;
import com.thuongmaidientu.backend.service.admin.AdminStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
// @CrossOrigin(...) // Thêm nếu cần
public class AdminStatsController {

    private final AdminStatsService adminStatsService;

    // API lấy thống kê tổng quan (Có bộ lọc range)
    // URL: /api/admin/stats/summary?range=today
    @GetMapping("/summary")
    public ResponseEntity<AdminStatsDTO> getStats(
            @RequestParam(defaultValue = "all") String range
    ) {
        // GỌI ĐÚNG HÀM MỚI TRONG SERVICE
        return ResponseEntity.ok(adminStatsService.getDashboardStats(range));
    }
}