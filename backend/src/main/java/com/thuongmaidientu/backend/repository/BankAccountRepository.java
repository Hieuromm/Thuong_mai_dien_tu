package com.thuongmaidientu.backend.repository;

import com.thuongmaidientu.backend.entity.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {
    List<BankAccount> findByUserId(Long userId);
    Optional<BankAccount> findByIdAndUserId(Long id, Long userId);
}