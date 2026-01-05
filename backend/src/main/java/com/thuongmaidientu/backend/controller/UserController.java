package com.thuongmaidientu.backend.controller;

import com.thuongmaidientu.backend.dto.request.UserProfileRequest;
import com.thuongmaidientu.backend.entity.User;
import com.thuongmaidientu.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    // Đường dẫn tới thư mục lưu avatar
    private final String UPLOAD_DIR = "uploads/avatars/";

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    // Thay đổi consumes để hỗ trợ cả dữ liệu text và file (Multipart)
    @PutMapping(value = "/profile", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> updateProfile(
            @RequestPart("data") UserProfileRequest request,
            @RequestPart(value = "avatar", required = false) MultipartFile avatarFile) throws IOException {

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Cập nhật các trường thông tin cơ bản
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setGender(request.getGender());
        user.setBirthday(request.getBirthday());

        // 2. Xử lý lưu file ảnh nếu có
        if (avatarFile != null && !avatarFile.isEmpty()) {
            // Tạo thư mục nếu chưa tồn tại
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Tạo tên file duy nhất để tránh trùng lặp
            String fileName = UUID.randomUUID().toString() + "_" + avatarFile.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            // Lưu file vào thư mục vật lý
            Files.copy(avatarFile.getInputStream(), filePath);

            // Lưu TÊN FILE vào database (Frontend sẽ nối chuỗi sau)
            user.setAvatarUrl(fileName);
        }

        userRepository.save(user);
        return ResponseEntity.ok("Cập nhật hồ sơ thành công!");
    }
}