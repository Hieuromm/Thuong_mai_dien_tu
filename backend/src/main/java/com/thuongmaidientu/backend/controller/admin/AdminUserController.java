package com.thuongmaidientu.backend.controller.admin;

import com.thuongmaidientu.backend.dto.response.admin.AdminUserDTO;
import com.thuongmaidientu.backend.entity.Role;
import com.thuongmaidientu.backend.service.admin.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminUserController {

    private final AdminUserService adminUserService;

    // 1. Lấy danh sách (CÓ LỌC THEO NGÀY)
    // URL ví dụ: /api/admin/users?range=today
    @GetMapping
    public ResponseEntity<List<AdminUserDTO>> getAllUsers(
            @RequestParam(defaultValue = "all") String range
    ) {
        // Truyền range vào service để lọc
        return ResponseEntity.ok(adminUserService.getAllUsers(range));
    }

    // 2. Xóa user
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            adminUserService.deleteUser(id);
            return ResponseEntity.ok(Map.of("message", "Xóa người dùng thành công!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 3. Update Role
    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestParam Role newRole) {
        try {
            adminUserService.updateUserRole(id, newRole);
            return ResponseEntity.ok(Map.of("message", "Cập nhật quyền thành công: " + newRole));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Đã xóa dòng "private final AdminStatsService..." bị thừa ở đây
}