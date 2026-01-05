package com.thuongmaidientu.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "chat_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String chatId;      // ID phòng chat (VD: user1_shop2)
    private String senderId;    // Người gửi
    private String recipientId; // Người nhận

    @Column(columnDefinition = "TEXT")
    private String content;     // Nội dung tin nhắn

    private String msgType;     // "TEXT" hoặc "PRODUCT"

    @Column(columnDefinition = "TEXT")
    private String metaData;    // JSON String chứa thông tin sản phẩm (ảnh, giá, tên)

    private Date timestamp;
}