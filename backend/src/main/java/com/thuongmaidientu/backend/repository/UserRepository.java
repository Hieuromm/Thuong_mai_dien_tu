package com.thuongmaidientu.backend.repository;

import com.thuongmaidientu.backend.entity.Role;
import com.thuongmaidientu.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Tìm kiếm user để đăng nhập
    Optional<User> findByUsername(String username);

    // Kiểm tra tồn tại để đăng ký
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    long countByRole(Role role);
}