package com.thuongmaidientu.backend.controller;

import com.thuongmaidientu.backend.entity.Product;
import com.thuongmaidientu.backend.repository.ProductRepository;
import com.thuongmaidientu.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;

    // 1. LẤY TẤT CẢ SẢN PHẨM
    @GetMapping
    public ResponseEntity<?> getAllProducts() {
        List<Product> products = productRepository.findAll();
        List<Product> visibleProducts = products.stream()
                .filter(p -> !p.isHidden())
                .toList();
        return ResponseEntity.ok(visibleProducts);
    }

    // 2. XEM CHI TIẾT SẢN PHẨM
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductDetail(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        if (product.isHidden()) {
            return ResponseEntity.badRequest().body("Sản phẩm này hiện không khả dụng");
        }
        return ResponseEntity.ok(product);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProducts(
            @RequestParam(required = false, defaultValue = "") String keyword,
            @RequestParam(required = false) List<String> categories,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false, defaultValue = "relevance") String sortBy
    ) {

        Sort sort = switch (sortBy) {
            case "price_asc" -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "latest" -> Sort.by("createdAt").descending();
            default -> Sort.by("id").descending(); // relevance
        };

        List<Product> results = productRepository.searchProductsWithFilters(
                keyword,
                categories,
                minPrice,
                maxPrice,
                sort
        );

        return ResponseEntity.ok(results);
    }
    @Autowired
    private ProductService productService;
    @GetMapping("/category/{name}")
    public ResponseEntity<List<Product>> getByCategory(@PathVariable String name) {
        return ResponseEntity.ok(productService.getProductsByCategory(name));
    }

}