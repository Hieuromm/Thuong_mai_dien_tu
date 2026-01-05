package com.thuongmaidientu.backend.controller;

import com.thuongmaidientu.backend.dto.response.ProductPublicResponse;
import com.thuongmaidientu.backend.dto.response.ShopPublicResponse;
import com.thuongmaidientu.backend.service.ShopPublicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/public/shops")
@RequiredArgsConstructor
public class PublicShopController {

    private final ShopPublicService shopService;

    @GetMapping("/{shopId}")
    public ResponseEntity<ShopPublicResponse> getShopDetail(@PathVariable Long shopId) {
        return ResponseEntity.ok(shopService.getShopInfo(shopId));
    }

    @GetMapping("/{shopId}/products")
    public ResponseEntity<List<ProductPublicResponse>> getProducts(
            @PathVariable Long shopId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit
    ) {
        return ResponseEntity.ok(shopService.getShopProducts(shopId, page, limit));
    }
}