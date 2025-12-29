package com.kitabqurdu.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    
    private Long id;
    
    private String username;
    
    private String email;
    
    private String firstName;
    
    private String lastName;
    
    private String phoneNumber;
    
    private String imageUrl;
    
    private String provider;
    
    private String role;
}
