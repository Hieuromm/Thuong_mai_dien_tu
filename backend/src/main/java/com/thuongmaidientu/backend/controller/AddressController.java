package com.thuongmaidientu.backend.controller;

import com.thuongmaidientu.backend.entity.Address;
import com.thuongmaidientu.backend.entity.User;
import com.thuongmaidientu.backend.repository.AddressRepository;
import com.thuongmaidientu.backend.repository.UserRepository;
import com.thuongmaidientu.backend.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user/addresses")

@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER', 'SELLER')")
public class AddressController {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final AddressService addressService;

    // --- HÀM MỚI: Lấy địa chỉ mặc định của một user cụ thể ---
    // URL: GET /api/user/addresses/user/{userId}/default
    @GetMapping("/user/{userId}/default")
    public ResponseEntity<?> getDefaultAddress(@PathVariable Long userId) {
        User currentUser = getCurrentUser();

        // Bảo mật: Nếu không phải Admin, chỉ cho phép lấy địa chỉ của chính mình
        if (!currentUser.getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Bạn không có quyền truy cập địa chỉ của người khác");
        }

        return addressRepository.findByUserIdAndIsDefaultTrue(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Lấy danh sách địa chỉ của chính mình (Đã có sẵn trong code của bạn)
    @GetMapping
    public ResponseEntity<?> getMyAddresses() {
        User user = getCurrentUser();
        return ResponseEntity.ok(addressRepository.findByUserId(user.getId()));
    }

    // Thêm địa chỉ (Đã có sẵn trong code của bạn)
    @PostMapping
    public ResponseEntity<?> addAddress(@RequestBody Address request) {
        User user = getCurrentUser();
        request.setUser(user);

        List<Address> existing = addressRepository.findByUserId(user.getId());
        if (existing.isEmpty()) {
            request.setDefault(true);
        } else if (request.isDefault()) {
            // Nếu set cái mới là mặc định, bỏ mặc định các cái cũ
            existing.forEach(addr -> {
                if (addr.isDefault()) {
                    addr.setDefault(false);
                    addressRepository.save(addr);
                }
            });
        }

        addressRepository.save(request);
        return ResponseEntity.ok(request);
    }

    // Thiết lập mặc định (Đã có sẵn trong code của bạn)
    @PutMapping("/{id}/default")
    public ResponseEntity<?> setDefault(@PathVariable Long id) {
        User user = getCurrentUser();
        List<Address> list = addressRepository.findByUserId(user.getId());

        for (Address addr : list) {
            addr.setDefault(addr.getId().equals(id));
            addressRepository.save(addr);
        }
        return ResponseEntity.ok(Map.of("message", "Đã đặt làm mặc định"));
    }

    // Xóa địa chỉ
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long id) {
        addressRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Xóa thành công"));
    }

    // Hàm lấy User đang đăng nhập từ Token
    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}