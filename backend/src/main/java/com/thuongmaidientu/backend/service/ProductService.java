package com.thuongmaidientu.backend.service;

import com.thuongmaidientu.backend.entity.Product;
import com.thuongmaidientu.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;
    public List<Product> getProductsByCategory(String categoryName) {
        return productRepository.findByCategory(categoryName);
    }
}