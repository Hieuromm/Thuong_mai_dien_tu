package com.thuongmaidientu.backend.controller;

import com.thuongmaidientu.backend.entity.Shop;
import com.thuongmaidientu.backend.entity.ShopVisit;
import com.thuongmaidientu.backend.repository.ShopVisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/visits")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ShopVisitController {
    private final ShopVisitRepository shopVisitRepository;

    @PostMapping("/log")
    public void logVisit(@RequestParam Long shopId, @RequestParam String source) {
        Shop shop = new Shop();
        shop.setId(shopId);

        ShopVisit visit = ShopVisit.builder()
                .shop(shop)
                .source(source)
                .build();
        shopVisitRepository.save(visit);
    }
}