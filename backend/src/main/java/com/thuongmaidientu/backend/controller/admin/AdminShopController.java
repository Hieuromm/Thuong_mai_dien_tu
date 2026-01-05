package com.thuongmaidientu.backend.controller.admin;

import com.thuongmaidientu.backend.service.admin.AdminShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/shops")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
// @CrossOrigin(origins = "http://localhost:5173") // Bật dòng này nếu bạn gặp lỗi CORS
public class AdminShopController {

    private final AdminShopService adminShopService;

    // 1. API Lấy danh sách Shop (CÓ BỘ LỌC NGÀY)
    @GetMapping
    public ResponseEntity<?> getAllShops(
            @RequestParam(defaultValue = "all") String range
    ) {
        // Truyền range vào service để lọc
        return ResponseEntity.ok(adminShopService.getAllShops(range));
    }

    // 2. Duyệt Shop
    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        return ResponseEntity.ok(adminShopService.approveShop(id));
    }

    // 3. Từ chối Shop
    @PostMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id) {
        return ResponseEntity.ok(adminShopService.rejectShop(id));
    }
}