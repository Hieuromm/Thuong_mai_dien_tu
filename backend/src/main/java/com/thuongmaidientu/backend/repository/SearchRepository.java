package com.thuongmaidientu.backend.repository;

import com.thuongmaidientu.backend.entity.SearchHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Pageable;
@Repository
public interface SearchRepository extends JpaRepository<SearchHistory, Long> {

    // Lấy danh sách từ khóa xuất hiện nhiều nhất
    @Query("SELECT s.keyword FROM SearchHistory s " +
            "GROUP BY s.keyword " +
            "ORDER BY COUNT(s.keyword) DESC")
    List<String> findTopKeywords(Pageable pageable);

    // Tùy chọn: Chỉ lấy các từ khóa hot trong 7 ngày gần đây
    @Query("SELECT s.keyword FROM SearchHistory s " +
            "WHERE s.createdAt >= :since " +
            "GROUP BY s.keyword " +
            "ORDER BY COUNT(s.keyword) DESC")
    List<String> findTrendingKeywords(@Param("since") LocalDateTime since, Pageable pageable);
}