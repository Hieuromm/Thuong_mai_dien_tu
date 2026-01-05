package com.thuongmaidientu.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thuongmaidientu.backend.entity.Shop;
import com.thuongmaidientu.backend.entity.User;
import com.thuongmaidientu.backend.repository.ShopRepository;
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
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@RestController
@RequestMapping("/api/seller/shop/profile")
@RequiredArgsConstructor
public class ShopProfileController {

    private final ShopRepository shopRepository;
    private final UserRepository userRepository;

    // Thư mục lưu logo shop
    private final String UPLOAD_DIR = "uploads/shops/";

    // 1. LẤY THÔNG TIN HỒ SƠ SHOP
    @GetMapping
    public ResponseEntity<?> getShopProfile() {
        // Lấy user đang đăng nhập
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        // Tìm shop theo user
        Shop shop = shopRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Bạn chưa đăng ký Shop"));

        return ResponseEntity.ok(shop);
    }

    // 2. CẬP NHẬT HỒ SƠ SHOP
    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateShopProfile(
            @RequestPart("data") String shopDataJson,
            @RequestPart(value = "logo", required = false) MultipartFile logoFile
    ) {
        try {
            // Xác thực User & Shop
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByUsername(username).orElseThrow();
            Shop shop = shopRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("Shop không tồn tại"));

            // Parse JSON từ Frontend
            ObjectMapper mapper = new ObjectMapper();
            Shop request = mapper.readValue(shopDataJson, Shop.class);

            // --- CẬP NHẬT THÔNG TIN ---
            // Lưu ý: Dùng setShopName vì bạn vừa đổi trong Entity
            // (Nhưng Frontend gửi key "name" thì Jackson vẫn map đúng nhờ @JsonProperty)
            shop.setShopName(request.getShopName());
            shop.setDescription(request.getDescription());

            // Nếu có thêm address/phone ở frontend thì set luôn tại đây
            // shop.setAddress(request.getAddress());
            // shop.setPhone(request.getPhone());

            // --- CẬP NHẬT LOGO (NẾU CÓ) ---
            if (logoFile != null && !logoFile.isEmpty()) {
                String fileName = saveFile(logoFile);
                shop.setLogoUrl(fileName);
            }

            shopRepository.save(shop);
            return ResponseEntity.ok(shop);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi cập nhật Shop: " + e.getMessage());
        }
    }

    // --- HÀM PHỤ: LƯU FILE ---
    private String saveFile(MultipartFile file) throws IOException {
        // Tạo tên file ngẫu nhiên: uuid_filename.jpg
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

        // Tạo thư mục uploads/shops nếu chưa có
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Copy file vào thư mục
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }
}