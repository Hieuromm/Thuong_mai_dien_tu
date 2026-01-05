package com.thuongmaidientu.backend.controller;

import com.thuongmaidientu.backend.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {
    private final SearchService searchService;

    // Endpoint cho phần "Gợi ý từ khóa" ở Header
    @GetMapping("/popular")
    public ResponseEntity<List<String>> getPopularKeywords() {
        // Lấy top 6 từ khóa phổ biến nhất
        List<String> keywords = searchService.getPopularKeywords(6);
        return ResponseEntity.ok(keywords);
    }

    // Cập nhật lại logic tìm kiếm của bạn để log từ khóa
    @GetMapping("/products")
    public ResponseEntity<?> searchProducts(@RequestParam String keyword) {
        // Lưu từ khóa vào database để thống kê
        searchService.logSearch(keyword);

        // Gọi logic tìm kiếm sản phẩm của bạn ở đây...
        return ResponseEntity.ok("Kết quả tìm kiếm cho: " + keyword);
    }
}