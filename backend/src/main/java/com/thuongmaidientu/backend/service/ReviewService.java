package com.thuongmaidientu.backend.service;

import com.thuongmaidientu.backend.dto.response.ReviewResponseDTO;
import java.util.List;

public interface ReviewService {
    List<ReviewResponseDTO> getReviewsByProduct(Long productId);
    void replyToReview(Long reviewId, String content, String username);
}