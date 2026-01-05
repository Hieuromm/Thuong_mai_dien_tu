package com.thuongmaidientu.backend.service;

import com.thuongmaidientu.backend.entity.Shop;
import com.thuongmaidientu.backend.entity.ShopVisit;
import com.thuongmaidientu.backend.repository.ShopRepository;
import com.thuongmaidientu.backend.repository.ShopVisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VisitService {
    private final ShopVisitRepository shopVisitRepository;
    private final ShopRepository shopRepository; // Inject thêm repository của Shop

    public void logVisit(Long shopId, Long productId, String source) {
        ShopVisit visit = new ShopVisit();

        // Bước quan trọng: Lấy đối tượng Shop từ ID trước khi set
        // getReferenceById giúp giữ nguyên kiểu dữ liệu Shop mà không làm chậm hệ thống
        Shop shop = shopRepository.getReferenceById(shopId);

        visit.setShop(shop);          // Bây giờ kiểu dữ liệu đã khớp (Shop -> Shop)
        visit.setProductId(productId);
        visit.setSource(source);

        shopVisitRepository.save(visit);
    }
}