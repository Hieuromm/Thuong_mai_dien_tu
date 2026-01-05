package com.thuongmaidientu.backend.controller;

import com.thuongmaidientu.backend.entity.ChatMessage;
import com.thuongmaidientu.backend.service.impl.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Controller
public class ChatController {

    @Autowired private SimpMessagingTemplate messagingTemplate;
    @Autowired private ChatService chatService;

    // 1. WebSocket: Nhận tin nhắn và gửi đi
    @MessageMapping("/chat.send")
    public void processMessage(@Payload ChatMessage chatMessage) {
        ChatMessage saved = chatService.save(chatMessage);

        // Gửi đến hàng đợi riêng của người nhận: /user/{recipientId}/queue/messages
        messagingTemplate.convertAndSendToUser(
                chatMessage.getRecipientId(),
                "/queue/messages",
                saved
        );
    }

    // 2. REST API: Lấy lịch sử chat
    @GetMapping("/api/messages/{senderId}/{recipientId}")
    public ResponseEntity<List<ChatMessage>> getChatHistory(
            @PathVariable String senderId,
            @PathVariable String recipientId) {
        return ResponseEntity.ok(chatService.getHistory(senderId, recipientId));
    }
}