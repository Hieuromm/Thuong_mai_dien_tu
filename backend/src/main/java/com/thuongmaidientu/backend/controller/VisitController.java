package com.thuongmaidientu.backend.controller;

import com.thuongmaidientu.backend.service.VisitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/visits")
@RequiredArgsConstructor
public class VisitController {
    private final VisitService visitService;

    @PostMapping("/log")
    public ResponseEntity<?> log(@RequestBody Map<String, Object> payload) {
        Long shopId = Long.valueOf(payload.get("shopId").toString());
        // productId có thể có hoặc không
        Long productId = payload.get("productId") != null ? Long.valueOf(payload.get("productId").toString()) : null;
        String source = payload.get("source").toString();

        visitService.logVisit(shopId, productId, source);
        return ResponseEntity.ok().build();
    }
}