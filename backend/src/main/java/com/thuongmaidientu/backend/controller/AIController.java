package com.thuongmaidientu.backend.controller;

import com.thuongmaidientu.backend.entity.Product;
import com.thuongmaidientu.backend.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AIController {

    private final AIService aiService;

    @GetMapping("/recommend/{userId}")
    public List<Product> getRecommendations(@PathVariable Long userId) {
        // Gọi service để lấy sản phẩm từ AI và Database
        return aiService.getRecommendations(userId);
    }
    @GetMapping("/trends/all")
    public ResponseEntity<Map<String, String>> getAllTrends() {
        String url = "http://localhost:8000/api/ai/trends/all";
        RestTemplate restTemplate = new RestTemplate();

        Map<String, String> trends = restTemplate.getForObject(url, Map.class);
        return ResponseEntity.ok(trends);
    }
    // 3. [BỔ SUNG] Xu hướng bán chạy toàn hệ thống (Global Trending)
    @GetMapping("/trending/system")
    public ResponseEntity<List<Product>> getGlobalTrending() {
        // Gọi qua Service để lấy dữ liệu sản phẩm đầy đủ từ MySQL
        return ResponseEntity.ok(aiService.getGlobalTrending());
    }

    // 4. [BỔ SUNG] Sản phẩm tương tự (Content-based Filtering)
    @GetMapping("/similar/{id}")
    public ResponseEntity<List<Product>> getSimilarProducts(@PathVariable Long id) {
        return ResponseEntity.ok(aiService.getSimilarProducts(id));
    }

}