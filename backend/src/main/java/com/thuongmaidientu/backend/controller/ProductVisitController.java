package com.thuongmaidientu.backend.controller;

import com.thuongmaidientu.backend.entity.Product;
import com.thuongmaidientu.backend.service.ProductVisitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/analytics")
//@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ProductVisitController {

    @Autowired
    private ProductVisitService productVisitService;


    @GetMapping("/top-visited")
    public ResponseEntity<List<Product>> getTopVisited() {
        List<Product> trendingProducts = productVisitService.getTopTrendingProducts();
        return ResponseEntity.ok(trendingProducts);
    }
}