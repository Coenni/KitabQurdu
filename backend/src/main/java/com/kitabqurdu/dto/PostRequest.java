package com.kitabqurdu.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
public class PostRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    private String authorName;
    
    private String bookTitle;
    
    private String genre;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;
    
    @NotBlank(message = "Condition is required")
    private String condition;
    
    @NotBlank(message = "City is required")
    private String city;
    
    private String area;
    
    private String contactPhone;
    
    private String contactEmail;
    
    private List<String> images = new ArrayList<>();
}
