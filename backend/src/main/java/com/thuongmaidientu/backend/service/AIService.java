package com.thuongmaidientu.backend.service;

import com.thuongmaidientu.backend.entity.Product;
import com.thuongmaidientu.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor; // Nếu bạn dùng Lombok

@Service
@RequiredArgsConstructor // Tự động tạo Constructor để Inject Repository
public class AIService {

    // Khai báo Repository để truy vấn bảng products
    private final ProductRepository productRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final String AI_URL = "http://localhost:8000/api/ai/recommend/";

    public List<Product> getRecommendations(Long userId) {
        RestTemplate restTemplate = new RestTemplate();


        List<Integer> productIds = restTemplate.getForObject(AI_URL + userId, List.class);

        if (productIds == null || productIds.isEmpty()) {
            return List.of();
        }

        return productRepository.findAllById(
                productIds.stream().map(Long::valueOf).toList()
        );
    }
    public List<Product> getGlobalTrending() {

        String url = "http://localhost:8000/api/ai/trending/system";
        RestTemplate restTemplate = new RestTemplate();
        List<Integer> trendingIds = restTemplate.getForObject(url, List.class);

        if (trendingIds != null && !trendingIds.isEmpty()) {
            List<Long> ids = trendingIds.stream()
                    .map(Integer::longValue)
                    .collect(Collectors.toList());
            return productRepository.findAllById(ids);
        }
        return Collections.emptyList();
    }
    // 3. [KHẮC PHỤC LỖI] Lấy sản phẩm tương tự (TF-IDF)
    public List<Product> getSimilarProducts(Long productId) {
        String url = "http://localhost:8000/api/ai/similar/" + productId;
        try {
            // Gọi Python lấy danh sách ID
            List<Integer> ids = restTemplate.getForObject(url, List.class);

            if (ids == null || ids.isEmpty()) return Collections.emptyList();

            // Chuyển sang Long và truy vấn MySQL
            List<Long> productIds = ids.stream().map(Integer::longValue).collect(Collectors.toList());
            return productRepository.findAllById(productIds);
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    // Hàm phụ trợ để chuyển đổi danh sách ID từ Python thành Object Product từ MySQL
    private List<Product> fetchProductsFromDb(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            return Collections.emptyList();
        }
        // Chuyển List<Integer> sang List<Long> để khớp với kiểu ID trong MySQL
        List<Long> longIds = ids.stream()
                .map(Integer::longValue)
                .collect(Collectors.toList());
        return productRepository.findAllById(longIds);
    }
}