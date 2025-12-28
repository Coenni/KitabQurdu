package com.kitabqurdu.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    
    private Long id;
    
    private String type;
    
    private String message;
    
    private Long relatedPostId;
    
    private Boolean isRead;
    
    private LocalDateTime createdAt;
}
