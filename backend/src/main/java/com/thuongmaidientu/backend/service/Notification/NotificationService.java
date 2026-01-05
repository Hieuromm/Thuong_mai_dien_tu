package com.thuongmaidientu.backend.service.Notification;

import com.thuongmaidientu.backend.entity.Notification;
import com.thuongmaidientu.backend.entity.User;
import com.thuongmaidientu.backend.repository.Notification.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;

    // 1. Hàm tạo thông báo chung (Được gọi từ các Service khác)
    public void createNotification(User user, String title, String message, String type, Long refId) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .referenceId(refId)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }

    // 2. Lấy danh sách thông báo của User
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // 3. Đếm số chưa đọc
    public long countUnread(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    // 4. Đánh dấu đã đọc
    public void markAsRead(Long id) {
        Notification noti = notificationRepository.findById(id).orElse(null);
        if (noti != null) {
            noti.setRead(true);
            notificationRepository.save(noti);
        }
    }
}