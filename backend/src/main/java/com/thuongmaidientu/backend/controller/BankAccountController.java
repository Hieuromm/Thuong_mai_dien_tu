package com.thuongmaidientu.backend.controller;

import com.thuongmaidientu.backend.entity.BankAccount;
import com.thuongmaidientu.backend.entity.User;
import com.thuongmaidientu.backend.repository.BankAccountRepository;
import com.thuongmaidientu.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user/banks")
@RequiredArgsConstructor
public class BankAccountController {

    private final BankAccountRepository bankRepository;
    private final UserRepository userRepository;

    // 1. Lấy danh sách ngân hàng
    @GetMapping
    public ResponseEntity<?> getMyBanks() {
        User user = getCurrentUser();
        return ResponseEntity.ok(bankRepository.findByUserId(user.getId()));
    }

    // 2. Thêm ngân hàng mới
    @PostMapping
    public ResponseEntity<?> addBank(@RequestBody BankAccount request) {
        User user = getCurrentUser();

        request.setUser(user);
        request.setVerified(true); // Giả lập là đã check thành công

        // Nếu đây là thẻ đầu tiên, set làm mặc định luôn
        List<BankAccount> existing = bankRepository.findByUserId(user.getId());
        if (existing.isEmpty()) {
            request.setDefault(true);
        } else {
            request.setDefault(false);
        }

        bankRepository.save(request);
        return ResponseEntity.ok(request);
    }

    // 3. Xóa ngân hàng
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBank(@PathVariable Long id) {
        User user = getCurrentUser();
        BankAccount bank = bankRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Ngân hàng không tồn tại"));

        bankRepository.delete(bank);
        return ResponseEntity.ok(Map.of("message", "Đã xóa thành công"));
    }

    // 4. Thiết lập mặc định
    @PutMapping("/{id}/default")
    public ResponseEntity<?> setDefault(@PathVariable Long id) {
        User user = getCurrentUser();
        List<BankAccount> allBanks = bankRepository.findByUserId(user.getId());

        for (BankAccount b : allBanks) {
            b.setDefault(b.getId().equals(id)); // Chỉ set true cho ID được chọn
            bankRepository.save(b);
        }
        return ResponseEntity.ok(Map.of("message", "Đã thiết lập mặc định"));
    }

    // Helper lấy User hiện tại từ Token
    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}