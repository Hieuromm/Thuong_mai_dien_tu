package com.thuongmaidientu.backend.repository.admin;

import com.thuongmaidientu.backend.entity.Role;
import com.thuongmaidientu.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AdminUserRepository extends JpaRepository<User, Long> {

    // Đếm tổng User đăng ký mới theo thời gian
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt BETWEEN :start AND :end")
    long countUsersByDate(LocalDateTime start, LocalDateTime end);

    // Đếm theo Role và thời gian (để vẽ biểu đồ phân bổ nếu cần)
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.createdAt BETWEEN :start AND :end")
    long countByRoleAndDate(Role role, LocalDateTime start, LocalDateTime end);

    //  Tìm tất cả user đăng ký trong khoảng thời gian (Sắp xếp mới nhất)
    List<User> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end);
}