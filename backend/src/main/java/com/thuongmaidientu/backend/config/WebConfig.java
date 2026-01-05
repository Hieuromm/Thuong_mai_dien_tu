package com.thuongmaidientu.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // 1. Cấu hình đường dẫn ảnh (Giữ nguyên)
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Ánh xạ URL /uploads/** vào thư mục vật lý uploads/
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:uploads/");
    }

    // 2. CẤU HÌNH CORS (QUAN TRỌNG) 👇
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Áp dụng cho toàn bộ API
                .allowedOriginPatterns("*")
                .allowedOrigins("http://localhost:5173") // Cho phép Frontend React
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 👈 Phải có PUT và DELETE
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}