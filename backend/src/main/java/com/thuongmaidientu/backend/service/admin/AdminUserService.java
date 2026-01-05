package com.thuongmaidientu.backend.service.admin;

import com.thuongmaidientu.backend.dto.response.admin.AdminUserDTO;
import com.thuongmaidientu.backend.entity.Role;
import com.thuongmaidientu.backend.entity.User;
// Import Repository riêng của Admin
import com.thuongmaidientu.backend.repository.admin.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    // Sử dụng Repository chuyên biệt cho Admin (đã có hàm lọc theo ngày)
    private final AdminUserRepository adminUserRepository;

    /**
     * Lấy danh sách user có lọc theo thời gian đăng ký
     * @param range: "today", "yesterday", "7days", "month", "all"
     */
    public List<AdminUserDTO> getAllUsers(String range) {
        LocalDateTime end = LocalDateTime.now();
        LocalDateTime start;

        // 1. Logic xác định khoảng thời gian (giống bên AdminStatsService)
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
            default: // "all" hoặc null
                start = LocalDateTime.of(2000, 1, 1, 0, 0);
                break;
        }

        // 2. Gọi Repository Admin để tìm kiếm
        List<User> users = adminUserRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(start, end);

        // 3. Mapping từ Entity -> DTO
        return users.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Transactional
    public void deleteUser(Long id) {
        // Dùng adminUserRepository vẫn có các hàm cơ bản như findById
        User userToDelete = adminUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + id));

        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        if (userToDelete.getUsername().equals(currentUsername)) {
            throw new RuntimeException("Bạn không thể tự xóa tài khoản Admin của chính mình!");
        }

        adminUserRepository.delete(userToDelete);
    }

    @Transactional
    public void updateUserRole(Long id, Role newRole) {
        User user = adminUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + id));

        user.setRole(newRole);
        adminUserRepository.save(user);
    }

    private AdminUserDTO mapToDTO(User user) {
        return AdminUserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole())
                .gender(user.getGender())
                .createdAt(user.getCreatedAt())
                .build();
    }
}