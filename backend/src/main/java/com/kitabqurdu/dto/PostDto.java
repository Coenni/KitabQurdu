package com.kitabqurdu.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {
    
    private Long id;
    
    private UserDto user;
    
    private String title;
    
    private String description;
    
    private String authorName;
    
    private String bookTitle;
    
    private String genre;
    
    private BigDecimal price;
    
    private String condition;
    
    private String city;
    
    private String area;
    
    private String contactPhone;
    
    private String contactEmail;
    
    private List<String> images;
    
    private String status;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
