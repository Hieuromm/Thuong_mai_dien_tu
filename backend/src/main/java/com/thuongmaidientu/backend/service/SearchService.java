package com.thuongmaidientu.backend.service;

import com.thuongmaidientu.backend.entity.SearchHistory;
import com.thuongmaidientu.backend.repository.SearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest; // Thêm dòng này
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchService {
    private final SearchRepository searchRepository;

    public void logSearch(String keyword) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            searchRepository.save(SearchHistory.builder()
                    .keyword(keyword.trim().toLowerCase())
                    .build());
        }
    }

    public List<String> getPopularKeywords(int limit) {
        // PageRequest.of(0, limit) sẽ lấy trang đầu tiên với số lượng phần tử là limit
        return searchRepository.findTopKeywords(PageRequest.of(0, limit));
    }
}