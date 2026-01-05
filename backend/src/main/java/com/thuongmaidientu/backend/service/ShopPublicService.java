package com.thuongmaidientu.backend.service;

import com.thuongmaidientu.backend.dto.response.ProductPublicResponse;
import com.thuongmaidientu.backend.dto.response.ShopPublicResponse;
import com.thuongmaidientu.backend.entity.Product;
import com.thuongmaidientu.backend.entity.Shop;
import com.thuongmaidientu.backend.repository.ProductRepository;
import com.thuongmaidientu.backend.repository.ShopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShopPublicService {

    private final ShopRepository shopRepository;
    private final ProductRepository productRepository;

    // Lấy thông tin Shop
    public ShopPublicResponse getShopInfo(Long shopId) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Shop không tồn tại"));

        // Giả sử count sản phẩm chưa ẩn
        int totalProducts = productRepository.countByShopIdAndIsHiddenFalse(shopId);

        return ShopPublicResponse.builder()
                .id(shop.getId())
                .name(shop.getShopName())
                .avatar(shop.getLogoUrl())
                .cover(shop.getCoverUrl())
                .description(shop.getDescription())
                .isOfficial(shop.isOfficial())
                .rating(shop.getRating() == null ? 0.0 : shop.getRating())
                .followerCount(shop.getFollowerCount())
                .totalProducts(totalProducts)
                .joinDate(shop.getCreatedAt().toLocalDate().toString())
                .build();
    }

    // Lấy danh sách sản phẩm
    public List<ProductPublicResponse> getShopProducts(Long shopId, int page, int limit) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<Product> productPage = productRepository.findByShopIdAndIsHiddenFalse(shopId, pageable);

        boolean isMall = shopRepository.findById(shopId).map(Shop::isOfficial).orElse(false);

        return productPage.getContent().stream().map(p -> ProductPublicResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .image(p.getImageUrl())
                .price(p.getPrice())
                .originalPrice(p.getPrice())
                .discount(0)
                .sold(0)
                .isMall(isMall)
                .shopId(p.getShop().getId())
                .build()
        ).collect(Collectors.toList());
    }
}