package com.thuongmaidientu.backend.repository;

import com.thuongmaidientu.backend.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByChatIdOrderByTimestampAsc(String chatId);
}