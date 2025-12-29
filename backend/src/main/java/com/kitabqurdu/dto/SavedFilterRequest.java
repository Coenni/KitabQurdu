package com.kitabqurdu.dto;

import lombok.Data;

@Data
public class SavedFilterRequest {
    
    private String name;
    
    private String filterCriteria; // JSON string
    
    private Boolean notificationEnabled = true;
}
