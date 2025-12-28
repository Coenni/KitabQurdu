package com.kitabqurdu.service;

import com.kitabqurdu.model.ChatMessage;
import com.kitabqurdu.model.User;
import com.kitabqurdu.repository.ChatMessageRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ChatService {
    
    private final ChatMessageRepository chatMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;
    
    public ChatService(ChatMessageRepository chatMessageRepository,
                      SimpMessagingTemplate messagingTemplate) {
        this.chatMessageRepository = chatMessageRepository;
        this.messagingTemplate = messagingTemplate;
    }
    
    @Transactional
    public ChatMessage sendMessage(User sender, User recipient, String content) {
        ChatMessage message = new ChatMessage();
        message.setSender(sender);
        message.setRecipient(recipient);
        message.setContent(content);
        message.setIsRead(false);
        
        ChatMessage saved = chatMessageRepository.save(message);
        
        // Send real-time message via WebSocket
        messagingTemplate.convertAndSendToUser(
            recipient.getUsername(),
            "/queue/messages",
            saved
        );
        
        return saved;
    }
    
    public List<ChatMessage> getConversation(User user1, User user2) {
        return chatMessageRepository.findConversation(user1, user2);
    }
    
    public List<ChatMessage> getUnreadMessages(User user) {
        return chatMessageRepository.findByRecipientAndIsReadFalseOrderByCreatedAtDesc(user);
    }
    
    @Transactional
    public void markAsRead(Long messageId, User user) {
        chatMessageRepository.findById(messageId)
            .filter(m -> m.getRecipient().getId().equals(user.getId()))
            .ifPresent(message -> {
                message.setIsRead(true);
                chatMessageRepository.save(message);
            });
    }
    
    public List<User> getConversationPartners(User user) {
        return chatMessageRepository.findConversationPartners(user);
    }
}
