package com.thuongmaidientu.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponseDTO {
    private Long id;
    private int rating;
    private String comment;
    private String shopResponse;
    private LocalDateTime createdAt;


    private List<String> images;

    private UserReviewDTO user;

    @Data
    @Builder
    public static class UserReviewDTO {
        private String fullName;
        private String avatar;
    }
}