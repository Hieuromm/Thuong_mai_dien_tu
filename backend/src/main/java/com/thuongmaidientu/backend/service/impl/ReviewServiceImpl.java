package com.thuongmaidientu.backend.service.impl;

import com.thuongmaidientu.backend.dto.response.ReviewResponseDTO;
import com.thuongmaidientu.backend.entity.Product;
import com.thuongmaidientu.backend.entity.Review;
import com.thuongmaidientu.backend.entity.User;
import com.thuongmaidientu.backend.repository.ReviewRepository;
import com.thuongmaidientu.backend.repository.UserRepository;
import com.thuongmaidientu.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    // 1. LẤY DANH SÁCH ĐÁNH GIÁ CỦA SẢN PHẨM
    @Override
    public List<ReviewResponseDTO> getReviewsByProduct(Long productId) {
        // Lấy từ DB, sắp xếp mới nhất lên đầu
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);

        // Convert Entity -> DTO
        return reviews.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    // 2. TRẢ LỜI ĐÁNH GIÁ (Dành cho Seller)
    @Override
    public void replyToReview(Long reviewId, String content, String username) {
        // A. Tìm Review
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Lỗi: Đánh giá không tồn tại (ID: " + reviewId + ")"));

        // B. Tìm User đang đăng nhập
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Lỗi: Người dùng không tồn tại"));

        // C. KIỂM TRA QUYỀN SỞ HỮU (Quan trọng!)
        // Logic: Người đang đăng nhập (currentUser) phải là chủ của Shop bán sản phẩm này
        Product product = review.getProduct();

        // Lưu ý: Tuỳ vào cấu trúc Entity của bạn, đoạn này có thể khác nhau.
        // Giả sử: Product -> Shop -> User (Owner)
        if (product.getShop() == null) {
            throw new RuntimeException("Lỗi dữ liệu: Sản phẩm này không thuộc Shop nào.");
        }

        User shopOwner = product.getShop().getUser(); // Lấy chủ shop từ quan hệ Product -> Shop -> User

        if (!shopOwner.getId().equals(currentUser.getId())) {
            throw new RuntimeException("Từ chối truy cập: Bạn không phải chủ Shop bán sản phẩm này!");
        }

        // D. Lưu câu trả lời
        review.setSellerReply(content);
        reviewRepository.save(review);
    }

    // --- HELPER: CHUYỂN ĐỔI ENTITY SANG DTO ---
    private ReviewResponseDTO mapToDTO(Review review) {
        // Xử lý ảnh Review (Database lưu tên file, API trả về Full URL)
        List<String> images = new ArrayList<>();
        if (review.getImageUrl() != null && !review.getImageUrl().isEmpty()) {
            String fullUrl;
            if (review.getImageUrl().startsWith("http")) {
                fullUrl = review.getImageUrl();
            } else {
                // Nối domain vào để Frontend hiển thị được ảnh
                fullUrl = "http://localhost:8080/images/reviews/" + review.getImageUrl();
            }
            images.add(fullUrl);
        }

        // Xử lý Avatar User
        String userAvatar = null;
        if (review.getUser() != null && review.getUser().getAvatarUrl() != null) {
            if (review.getUser().getAvatarUrl().startsWith("http")) {
                userAvatar = review.getUser().getAvatarUrl();
            } else {
                userAvatar = "http://localhost:8080/images/avatars/" + review.getUser().getAvatarUrl();
            }
        }

        return ReviewResponseDTO.builder()
                .id(review.getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .shopResponse(review.getSellerReply()) // Trả về câu trả lời của Shop
                .createdAt(review.getCreatedAt())
                .images(images) // Frontend nhận List<String>
                .user(ReviewResponseDTO.UserReviewDTO.builder()
                        .fullName(review.getUser() != null ? review.getUser().getFullName() : "Người dùng ẩn danh")
                        .avatar(userAvatar)
                        .build())
                .build();
    }
}