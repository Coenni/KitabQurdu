package com.kitabqurdu.controller;

import com.kitabqurdu.dto.NotificationDto;
import com.kitabqurdu.model.User;
import com.kitabqurdu.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    
    private final NotificationService notificationService;
    
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }
    
    @GetMapping
    public ResponseEntity<List<NotificationDto>> getNotifications(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(notificationService.getUserNotifications(user));
    }
    
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationDto>> getUnreadNotifications(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(notificationService.getUnreadNotifications(user));
    }
    
    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        notificationService.markAsRead(id, user);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(
            @AuthenticationPrincipal User user) {
        notificationService.markAllAsRead(user);
        return ResponseEntity.ok().build();
    }
}
