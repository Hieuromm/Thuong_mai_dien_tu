package com.thuongmaidientu.backend.service.impl;

import com.thuongmaidientu.backend.entity.ChatMessage;
import com.thuongmaidientu.backend.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ChatService {
    @Autowired private ChatMessageRepository repository;

    public ChatMessage save(ChatMessage msg) {
        // Tạo chatId chung: userA nhắn userB hay ngược lại thì chatId vẫn giống nhau
        String chatId = (msg.getSenderId().compareTo(msg.getRecipientId()) < 0)
                ? msg.getSenderId() + "_" + msg.getRecipientId()
                : msg.getRecipientId() + "_" + msg.getSenderId();

        msg.setChatId(chatId);
        msg.setTimestamp(new java.util.Date());
        return repository.save(msg);
    }

    public List<ChatMessage> getHistory(String senderId, String recipientId) {
        String chatId = (senderId.compareTo(recipientId) < 0)
                ? senderId + "_" + recipientId
                : recipientId + "_" + senderId;
        return repository.findByChatIdOrderByTimestampAsc(chatId);
    }
}