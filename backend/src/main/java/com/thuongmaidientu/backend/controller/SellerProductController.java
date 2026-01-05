package com.thuongmaidientu.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thuongmaidientu.backend.dto.request.ProductRequest;
import com.thuongmaidientu.backend.entity.*;
import com.thuongmaidientu.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/seller/products")
@RequiredArgsConstructor
public class SellerProductController {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;
    private final ShopRepository shopRepository;
    private final UserRepository userRepository;

    // Đường dẫn lưu ảnh (Đảm bảo bạn đã cấu hình ResourceHandler hoặc Security cho thư mục này)
    private final String UPLOAD_DIR = "uploads/products/";

    // ==========================================
    // 1. API THÊM SẢN PHẨM MỚI
    // ==========================================
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addProduct(
            @RequestPart("data") String productDataJson,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        try {
            // A. Convert JSON -> Object
            ObjectMapper mapper = new ObjectMapper();
            ProductRequest request = mapper.readValue(productDataJson, ProductRequest.class);

            // B. Check Auth & Shop
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Shop shop = shopRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("Bạn chưa có Shop! Vui lòng đăng ký Shop trước."));

            // C. Tạo Product (Cha)
            Product product = new Product();
            product.setShop(shop);
            product.setName(request.getName());
            product.setDescription(request.getDescription());
            product.setCategory(request.getCategory());
            product.setWeight(request.getWeight());
            product.setHidden(request.isHidden());

            // --- QUAN TRỌNG: Sản phẩm mới luôn là PENDING ---
            product.setStatus(ProductStatus.PENDING);
            // ------------------------------------------------

            // --- XỬ LÝ ẢNH ---
            List<String> savedFileNames = new ArrayList<>();
            if (images != null && !images.isEmpty()) {
                for (MultipartFile file : images) {
                    String fileName = saveFile(file);
                    if (fileName != null) {
                        savedFileNames.add(fileName);
                    }
                }
            }

            if (!savedFileNames.isEmpty()) {
                product.setImageUrl(savedFileNames.get(0)); // Ảnh đầu tiên là Avatar
            } else if (request.getImageUrl() != null) {
                product.setImageUrl(request.getImageUrl());
            }

            // --- XỬ LÝ GIÁ & KHO ---
            boolean hasVariants = request.getVariants() != null && !request.getVariants().isEmpty();
            product.setHasVariants(hasVariants);

            if (hasVariants) {
                product.setVariant1Name(request.getVariant1Name());
                product.setVariant2Name(request.getVariant2Name());
                double minPrice = request.getVariants().stream()
                        .mapToDouble(ProductRequest.ProductVariantRequest::getPrice).min().orElse(0);
                product.setPrice(minPrice);
                product.setStock(0);
            } else {
                product.setPrice(request.getPrice());
                product.setStock(request.getStock());
            }

            // D. Lưu Product
            Product savedProduct = productRepository.save(product);

            // E. Lưu Ảnh phụ
            if (!savedFileNames.isEmpty()) {
                List<ProductImage> productImages = new ArrayList<>();
                for (String fileName : savedFileNames) {
                    ProductImage pi = new ProductImage();
                    pi.setProduct(savedProduct);
                    pi.setImageUrl(fileName);
                    productImages.add(pi);
                }
                productImageRepository.saveAll(productImages);
            }

            // F. Lưu Biến thể
            if (hasVariants) {
                List<ProductVariant> variantsToSave = new ArrayList<>();
                for (ProductRequest.ProductVariantRequest vReq : request.getVariants()) {
                    ProductVariant variant = new ProductVariant();
                    variant.setProduct(savedProduct);
                    variant.setValue1(vReq.getValue1());
                    variant.setValue2(vReq.getValue2());
                    variant.setPrice(vReq.getPrice());
                    variant.setStock(vReq.getStock());
                    variant.setImageUrl(savedProduct.getImageUrl());
                    variantsToSave.add(variant);
                }
                productVariantRepository.saveAll(variantsToSave);
            }

            return ResponseEntity.ok(savedProduct);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi thêm sản phẩm: " + e.getMessage());
        }
    }

    // ==========================================
    // 2. CẬP NHẬT SẢN PHẨM
    // ==========================================
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestPart("data") String productDataJson,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        try {
            // Check quyền sở hữu
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByUsername(username).orElseThrow();
            Shop shop = shopRepository.findByUserId(user.getId()).orElseThrow();

            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

            if (!product.getShop().getId().equals(shop.getId())) {
                return ResponseEntity.status(403).body("Bạn không có quyền sửa sản phẩm này");
            }

            ObjectMapper mapper = new ObjectMapper();
            ProductRequest request = mapper.readValue(productDataJson, ProductRequest.class);

            // Update thông tin cơ bản
            product.setName(request.getName());
            product.setDescription(request.getDescription());
            product.setCategory(request.getCategory());
            product.setWeight(request.getWeight());
            product.setHidden(request.isHidden());

            // --- QUAN TRỌNG: Sửa xong phải chờ duyệt lại ---
            product.setStatus(ProductStatus.PENDING);
            // -----------------------------------------------

            // --- XỬ LÝ ẢNH MỚI (Nếu có) ---
            if (images != null && !images.isEmpty()) {
                List<ProductImage> oldImages = productImageRepository.findByProductId(id);
                productImageRepository.deleteAll(oldImages);

                List<ProductImage> newImages = new ArrayList<>();
                String newMainImage = null;

                for (int i = 0; i < images.size(); i++) {
                    String fileName = saveFile(images.get(i));
                    if (fileName == null) continue;
                    if (i == 0) newMainImage = fileName;

                    ProductImage pi = new ProductImage();
                    pi.setProduct(product);
                    pi.setImageUrl(fileName);
                    newImages.add(pi);
                }
                product.setImageUrl(newMainImage);
                productImageRepository.saveAll(newImages);
            }

            // --- XỬ LÝ BIẾN THỂ ---
            boolean hasVariants = request.getVariants() != null && !request.getVariants().isEmpty();
            product.setHasVariants(hasVariants);

            List<ProductVariant> oldVariants = productVariantRepository.findByProductId(id);
            productVariantRepository.deleteAll(oldVariants);

            if (hasVariants) {
                product.setVariant1Name(request.getVariant1Name());
                product.setVariant2Name(request.getVariant2Name());

                List<ProductVariant> newVariants = new ArrayList<>();
                double minPrice = Double.MAX_VALUE;

                for (ProductRequest.ProductVariantRequest vReq : request.getVariants()) {
                    ProductVariant v = new ProductVariant();
                    v.setProduct(product);
                    v.setValue1(vReq.getValue1());
                    v.setValue2(vReq.getValue2());
                    v.setPrice(vReq.getPrice());
                    v.setStock(vReq.getStock());
                    v.setImageUrl(product.getImageUrl());
                    newVariants.add(v);
                    if (v.getPrice() < minPrice) minPrice = v.getPrice();
                }
                productVariantRepository.saveAll(newVariants);
                product.setPrice(minPrice);
                product.setStock(0);
            } else {
                product.setPrice(request.getPrice());
                product.setStock(request.getStock());
            }

            productRepository.save(product);
            return ResponseEntity.ok(product); // Trả về object đã update để frontend cập nhật UI

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi cập nhật: " + e.getMessage());
        }
    }

    // ==========================================
    // 3. CÁC API KHÁC
    // ==========================================

    // Lấy danh sách sản phẩm của Shop mình (Hiển thị cả PENDING, REJECTED để shop biết)
    @GetMapping
    public ResponseEntity<?> getMyProducts() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        Shop shop = shopRepository.findByUserId(user.getId()).orElseThrow();

        // Nên trả về DTO thay vì Entity để tránh lộ thông tin thừa, nhưng hiện tại trả Entity cũng ok
        return ResponseEntity.ok(productRepository.findByShopId(shop.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductDetail(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        Shop shop = shopRepository.findByUserId(user.getId()).orElseThrow();

        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));

        if (!product.getShop().getId().equals(shop.getId())) {
            return ResponseEntity.status(403).body("Không có quyền truy cập sản phẩm này");
        }
        return ResponseEntity.ok(product);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        Shop shop = shopRepository.findByUserId(user.getId()).orElseThrow();

        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));

        if (!product.getShop().getId().equals(shop.getId())) {
            return ResponseEntity.status(403).body("Không có quyền xóa sản phẩm này");
        }

        productRepository.deleteById(id);
        return ResponseEntity.ok("Đã xóa sản phẩm");
    }

    // --- HELPER ---
    private String saveFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) return null;
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return fileName; // Frontend sẽ cần domain + "/images/" + fileName để hiển thị
    }
}