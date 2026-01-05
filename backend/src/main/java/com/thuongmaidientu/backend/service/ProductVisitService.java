package com.thuongmaidientu.backend.service;

import com.thuongmaidientu.backend.entity.Product;
import com.thuongmaidientu.backend.repository.ProductVisitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductVisitService {

    @Autowired
    private ProductVisitRepository productVisitRepository;

    public List<Product> getTopTrendingProducts() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        return productVisitRepository.findTrendingProducts(sevenDaysAgo, PageRequest.of(0, 10));
    }
}