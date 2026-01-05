package com.thuongmaidientu.backend.service.impl;

import com.thuongmaidientu.backend.dto.request.ShopRegisterRequest;
import com.thuongmaidientu.backend.dto.response.LoginResponse;
import com.thuongmaidientu.backend.entity.Role;
import com.thuongmaidientu.backend.entity.Shop;
import com.thuongmaidientu.backend.entity.ShopStatus;
import com.thuongmaidientu.backend.entity.User;
import com.thuongmaidientu.backend.repository.ShopRepository;
import com.thuongmaidientu.backend.repository.UserRepository;
import com.thuongmaidientu.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ShopServiceImpl {

    private final ShopRepository shopRepository;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public LoginResponse registerShop(ShopRegisterRequest request) {

        // 1. Lấy user hiện tại từ Token
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        // 2. Kiểm tra: Một user chỉ được tạo 1 shop
        if (shopRepository.findByUserId(user.getId()).isPresent()) {
            throw new RuntimeException("Bạn đã gửi yêu cầu mở Shop hoặc đã sở hữu Shop rồi!");
        }

        // 3. Kiểm tra trùng tên Shop
        if (shopRepository.existsByShopName(request.getShopName())) {
            throw new RuntimeException("Tên Shop này đã được sử dụng, vui lòng chọn tên khác!");
        }

        // 4. Map dữ liệu từ Request sang Entity Shop
        Shop shop = new Shop();
        shop.setUser(user);

        // --- QUAN TRỌNG: Map đúng trường từ DTO ---
        shop.setShopName(request.getShopName());
        shop.setDescription(request.getDescription());
        shop.setAddress(request.getAddress()); // Lưu địa chỉ
        shop.setPhone(request.getPhone());     // Lưu số điện thoại

        // --- QUAN TRỌNG: Set trạng thái PENDING ---
        shop.setStatus(ShopStatus.PENDING);

        // Set giá trị mặc định
        shop.setLogoUrl(user.getAvatarUrl()); // Mặc định lấy avatar user làm logo
        shop.setOfficial(false);
        shop.setRating(0.0);
        shop.setFollowerCount(0);

        // Lưu vào Database
        shopRepository.save(shop);

        // 5. Tạo Response trả về
        // Lưu ý: Role user vẫn là BUYER (chưa nâng cấp)
        return LoginResponse.builder()
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name()) // Vẫn giữ role cũ
                .shopStatus("PENDING")       // BẮT BUỘC CÓ để Frontend hiện màn hình chờ
                .token(jwtTokenProvider.generateToken(user.getUsername()))
                .build();
    }

    @Transactional
    public Shop approveShop(Long shopId) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Shop với ID: " + shopId));

        // Đổi trạng thái Shop
        shop.setStatus(ShopStatus.ACTIVE);

        // Nâng quyền User lên SELLER
        User owner = shop.getUser();
        owner.setRole(Role.SELLER);
        userRepository.save(owner);

        return shopRepository.save(shop);
    }

    @Transactional
    public void rejectShop(Long shopId) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Shop"));

        shopRepository.delete(shop); // Hoặc setStatus(ShopStatus.REJECTED) tùy logic
    }
}