package com.thuongmaidientu.backend.controller;

import com.thuongmaidientu.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")

public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<String> getCategories() {
        return categoryService.getAllCategoryNames();
    }
}