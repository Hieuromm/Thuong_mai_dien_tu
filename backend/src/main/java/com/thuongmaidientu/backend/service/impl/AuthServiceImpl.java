package com.thuongmaidientu.backend.service.impl;

import com.thuongmaidientu.backend.dto.request.LoginRequest;
import com.thuongmaidientu.backend.dto.request.RegisterRequest;
import com.thuongmaidientu.backend.dto.response.LoginResponse;
import com.thuongmaidientu.backend.entity.Role;
import com.thuongmaidientu.backend.entity.User;
import com.thuongmaidientu.backend.repository.UserRepository;
import com.thuongmaidientu.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional // Thêm Transactional để đảm bảo tính toàn vẹn khi lưu DB
    public String register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email này đã được sử dụng!");
        }

        User user = User.builder()
                .username(request.getUsername())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(Role.BUYER) // Đăng ký mặc định là BUYER
                .avatarUrl("https://via.placeholder.com/150")
                .build();

        userRepository.save(user);
        return "Đăng ký tài khoản thành công!";
    }

    public LoginResponse login(LoginRequest request) {
        // 1. Tìm user
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Tài khoản hoặc mật khẩu không chính xác!"));

        // 2. Kiểm tra mật khẩu (Nên dùng thông báo chung để tăng tính bảo mật)
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Tài khoản hoặc mật khẩu không chính xác!");
        }

        // 3. Sinh Token
        String token = jwtTokenProvider.generateToken(user.getUsername());

        // 4. Trả về LoginResponse
        return LoginResponse.builder()
                .id(user.getId())
                .token(token)
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                // .name() trả về String của Enum (ADMIN, SELLER, BUYER)
                .role(user.getRole().name())
                .build();
    }
}