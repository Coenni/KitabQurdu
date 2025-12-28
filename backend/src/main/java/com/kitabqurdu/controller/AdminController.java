package com.kitabqurdu.controller;

import com.kitabqurdu.model.Announcement;
import com.kitabqurdu.model.User;
import com.kitabqurdu.repository.AnnouncementRepository;
import com.kitabqurdu.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    private final UserRepository userRepository;
    private final AnnouncementRepository announcementRepository;
    
    public AdminController(UserRepository userRepository,
                          AnnouncementRepository announcementRepository) {
        this.userRepository = userRepository;
        this.announcementRepository = announcementRepository;
    }
    
    @GetMapping("/users")
    public ResponseEntity<Page<User>> getUsers(Pageable pageable) {
        return ResponseEntity.ok(userRepository.findAll(pageable));
    }
    
    @PutMapping("/users/{id}/suspend")
    public ResponseEntity<Void> suspendUser(@PathVariable Long id) {
        userRepository.findById(id).ifPresent(user -> {
            user.setEnabled(false);
            userRepository.save(user);
        });
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/users/{id}/activate")
    public ResponseEntity<Void> activateUser(@PathVariable Long id) {
        userRepository.findById(id).ifPresent(user -> {
            user.setEnabled(true);
            userRepository.save(user);
        });
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/announcements")
    public ResponseEntity<Announcement> createAnnouncement(@RequestBody Map<String, String> request) {
        Announcement announcement = new Announcement();
        announcement.setMessage(request.get("message"));
        announcement.setActive(true);
        announcement.setCreatedAt(LocalDateTime.now());
        
        if (request.containsKey("expiresAt")) {
            announcement.setExpiresAt(LocalDateTime.parse(request.get("expiresAt")));
        }
        
        return ResponseEntity.ok(announcementRepository.save(announcement));
    }
    
    @GetMapping("/announcements")
    public ResponseEntity<Page<Announcement>> getAnnouncements(Pageable pageable) {
        return ResponseEntity.ok(announcementRepository.findAll(pageable));
    }
    
    @PutMapping("/announcements/{id}/deactivate")
    public ResponseEntity<Void> deactivateAnnouncement(@PathVariable Long id) {
        announcementRepository.findById(id).ifPresent(announcement -> {
            announcement.setActive(false);
            announcementRepository.save(announcement);
        });
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("activeUsers", userRepository.countByEnabledTrue());
        // Add more stats as needed
        return ResponseEntity.ok(stats);
    }
}
