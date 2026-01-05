package com.thuongmaidientu.backend.controller;

import com.thuongmaidientu.backend.dto.request.LoginRequest;
import com.thuongmaidientu.backend.dto.request.RegisterRequest;
import com.thuongmaidientu.backend.dto.response.LoginResponse;
import com.thuongmaidientu.backend.service.impl.AuthServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthServiceImpl authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // Gọi xuống tầng Service để xử lý logic
            String message = authService.register(request);

            // Trả về JSON: { "message": "Đăng ký tài khoản thành công!" }
            return ResponseEntity.ok(Map.of("message", message));
        } catch (RuntimeException e) {
            // Nếu có lỗi (trùng tên, trùng email...) trả về lỗi 400 Bad Request
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Gọi Service để kiểm tra đăng nhập và lấy Token
            LoginResponse response = authService.login(request);

            // Trả về thông tin user kèm Token
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // Nếu sai mật khẩu hoặc tài khoản không tồn tại
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}