package com.thuongmaidientu.backend.service;

import com.thuongmaidientu.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<String> getAllCategoryNames() {
        return categoryRepository.findDistinctCategories();
    }
}