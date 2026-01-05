package com.thuongmaidientu.backend.service.user;


import com.thuongmaidientu.backend.entity.User;
import com.thuongmaidientu.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // 1. Tìm User theo Username
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // 2. Tìm User theo ID
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + id));
    }

    // 3. Lấy thông tin User đang đăng nhập hiện tại (QUAN TRỌNG NHẤT)
    // Hàm này sẽ được dùng trong các Controller để biết "Ai đang gọi API này?"
    public User getUserFromContext() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new RuntimeException("Người dùng chưa đăng nhập!");
        }

        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng: " + username));
    }

    // 4. Lưu / Cập nhật User
    @Transactional
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // 5. Kiểm tra tồn tại (Dùng cho đăng ký)
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}