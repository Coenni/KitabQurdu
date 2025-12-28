package com.kitabqurdu.repository;

import com.kitabqurdu.model.ChatMessage;
import com.kitabqurdu.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    @Query("SELECT cm FROM ChatMessage cm WHERE " +
           "(cm.sender = :user1 AND cm.recipient = :user2) OR " +
           "(cm.sender = :user2 AND cm.recipient = :user1) " +
           "ORDER BY cm.createdAt ASC")
    List<ChatMessage> findConversation(@Param("user1") User user1, @Param("user2") User user2);
    
    List<ChatMessage> findByRecipientAndIsReadFalseOrderByCreatedAtDesc(User recipient);
    
    @Query("SELECT DISTINCT CASE WHEN cm.sender = :user THEN cm.recipient ELSE cm.sender END " +
           "FROM ChatMessage cm WHERE cm.sender = :user OR cm.recipient = :user")
    List<User> findConversationPartners(@Param("user") User user);
}
