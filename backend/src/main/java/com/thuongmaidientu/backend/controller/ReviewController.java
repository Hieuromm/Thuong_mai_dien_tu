package com.thuongmaidientu.backend.controller;

import com.thuongmaidientu.backend.dto.response.ReviewResponseDTO;
import com.thuongmaidientu.backend.entity.*;
import com.thuongmaidientu.backend.repository.*;
import com.thuongmaidientu.backend.service.ReviewService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // ==================================================================
    // 1. API KHÁCH HÀNG TẠO ĐÁNH GIÁ (Có Upload ảnh)
    // URL: POST /api/reviews/create
    // ==================================================================
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createReview(
            @RequestParam("orderId") Long orderId,
            @RequestParam("productId") Long productId,
            @RequestParam("rating") int rating,
            @RequestParam(value = "comment", required = false) String comment,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        try {
            // Lấy User đang đăng nhập
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

            // Kiểm tra đơn hàng
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

            // Validate quyền đánh giá
            if (!order.getUser().getId().equals(user.getId())) {
                return ResponseEntity.badRequest().body("Bạn không sở hữu đơn hàng này");
            }
            if (order.getStatus() != OrderStatus.COMPLETED) {
                return ResponseEntity.badRequest().body("Đơn hàng chưa hoàn thành, không thể đánh giá");
            }

            // Kiểm tra sản phẩm
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

            // Lưu ảnh (Nếu có)
            String storedFileName = null;
            if (image != null && !image.isEmpty()) {
                storedFileName = saveFile(image);
            }

            // Lưu vào DB
            Review review = Review.builder()
                    .user(user)
                    .order(order)
                    .product(product)
                    .rating(rating)
                    .comment(comment)
                    .imageUrl(storedFileName)
                    .build();

            reviewRepository.save(review);
            return ResponseEntity.ok("Đánh giá thành công!");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi tạo đánh giá: " + e.getMessage());
        }
    }

    // ==================================================================
    // 2. API XEM DANH SÁCH ĐÁNH GIÁ (Public)
    // URL: GET /api/reviews/product/{productId}
    // ==================================================================
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponseDTO>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId));
    }

    // ==================================================================
    // 3. API NGƯỜI BÁN TRẢ LỜI ĐÁNH GIÁ (Authenticated)
    // URL: POST /api/reviews/reply
    // ==================================================================

    // DTO hứng dữ liệu gửi lên
    @Data
    static class ReplyRequest {
        private Long reviewId;
        private String content;
    }

    @PostMapping("/reply")
    public ResponseEntity<?> replyReview(@RequestBody ReplyRequest request) {
        // Lấy username người đang đăng nhập (để check quyền chủ shop)
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        try {
            reviewService.replyToReview(request.getReviewId(), request.getContent(), username);
            return ResponseEntity.ok("Đã gửi câu trả lời thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // Trả về lỗi nếu không phải chủ shop
        }
    }

    // ==================================================================
    // HELPER: LƯU FILE ẢNH
    // ==================================================================
    private String saveFile(MultipartFile file) {
        try {
            // Tạo tên file ngẫu nhiên để tránh trùng
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

            // Đường dẫn lưu file: project_folder/uploads/reviews
            Path uploadPath = Paths.get("uploads/reviews");

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Files.copy(file.getInputStream(), uploadPath.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Lỗi lưu ảnh: " + e.getMessage());
        }
    }
}