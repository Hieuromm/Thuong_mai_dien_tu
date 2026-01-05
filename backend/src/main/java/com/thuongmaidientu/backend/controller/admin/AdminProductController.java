package com.thuongmaidientu.backend.controller.admin;

import com.thuongmaidientu.backend.dto.response.admin.AdminProductDTO;
import com.thuongmaidientu.backend.entity.ProductStatus;
import com.thuongmaidientu.backend.service.admin.AdminProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
// @CrossOrigin(origins = "http://localhost:5173") // Bật nếu cần xử lý CORS
public class AdminProductController {

    private final AdminProductService adminProductService;

    // 1. Lấy danh sách (CẬP NHẬT: Thêm @RequestParam range)
    @GetMapping
    public ResponseEntity<List<AdminProductDTO>> getAllProducts(
            @RequestParam(defaultValue = "all") String range
    ) {
        // Truyền tham số range vào Service để lọc dữ liệu
        return ResponseEntity.ok(adminProductService.getAllProducts(range));
    }

    // 2. Cập nhật trạng thái (Duyệt/Từ chối)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam ProductStatus status) {
        try {
            adminProductService.updateProductStatus(id, status);
            return ResponseEntity.ok(Map.of("message", "Cập nhật trạng thái thành công: " + status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 3. Xóa sản phẩm
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            adminProductService.deleteProduct(id);
            return ResponseEntity.ok(Map.of("message", "Xóa sản phẩm thành công!"));
        } catch (Exception e) {
            // Bắt lỗi để trả về JSON đẹp hơn thay vì lỗi 500
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}