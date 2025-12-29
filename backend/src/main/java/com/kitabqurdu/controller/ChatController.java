package com.kitabqurdu.controller;

import com.kitabqurdu.model.ChatMessage;
import com.kitabqurdu.model.User;
import com.kitabqurdu.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
public class ChatController {
    
    private final ChatService chatService;
    
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }
    
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload Map<String, Object> message,
                           @AuthenticationPrincipal User sender) {
        // WebSocket message handling
        Long recipientId = Long.valueOf(message.get("recipientId").toString());
        String content = message.get("content").toString();
        
        User recipient = new User();
        recipient.setId(recipientId);
        
        chatService.sendMessage(sender, recipient, content);
    }
    
    @GetMapping("/api/chat/conversations")
    @ResponseBody
    public ResponseEntity<List<User>> getConversations(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(chatService.getConversationPartners(user));
    }
    
    @GetMapping("/api/chat/messages/{userId}")
    @ResponseBody
    public ResponseEntity<List<ChatMessage>> getConversation(
            @PathVariable Long userId,
            @AuthenticationPrincipal User user) {
        User other = new User();
        other.setId(userId);
        return ResponseEntity.ok(chatService.getConversation(user, other));
    }
    
    @GetMapping("/api/chat/unread")
    @ResponseBody
    public ResponseEntity<List<ChatMessage>> getUnreadMessages(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(chatService.getUnreadMessages(user));
    }
    
    @PutMapping("/api/chat/messages/{id}/read")
    @ResponseBody
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        chatService.markAsRead(id, user);
        return ResponseEntity.ok().build();
    }
}
