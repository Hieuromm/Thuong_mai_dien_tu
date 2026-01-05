package com.thuongmaidientu.backend.controller;

import com.thuongmaidientu.backend.dto.request.ShopRegisterRequest;
import com.thuongmaidientu.backend.service.impl.ShopServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/seller/shop")
@RequiredArgsConstructor
public class ShopController {

    private final ShopServiceImpl shopService;

    @PostMapping("/register")
    // THÊM @Valid và @RequestBody
    public ResponseEntity<?> registerShop(@Valid @RequestBody ShopRegisterRequest request) {
        try {
            var response = shopService.registerShop(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // Trả về lỗi 400 kèm message để Frontend hiển thị alert
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}