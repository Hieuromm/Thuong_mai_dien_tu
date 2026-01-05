package com.thuongmaidientu.backend.controller.Notification;

import com.thuongmaidientu.backend.entity.User;
import com.thuongmaidientu.backend.service.Notification.NotificationService;
import com.thuongmaidientu.backend.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    private final UserService userService; // Service để tìm User từ Token

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userService.findByUsername(username).orElseThrow();
    }

    @GetMapping
    public ResponseEntity<?> getMyNotifications() {
        User user = getCurrentUser();
        return ResponseEntity.ok(notificationService.getUserNotifications(user.getId()));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> countUnread() {
        User user = getCurrentUser();
        return ResponseEntity.ok(notificationService.countUnread(user.getId()));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}