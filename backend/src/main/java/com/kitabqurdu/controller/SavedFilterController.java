package com.kitabqurdu.controller;

import com.kitabqurdu.dto.SavedFilterRequest;
import com.kitabqurdu.model.SavedFilter;
import com.kitabqurdu.security.UserPrincipal;
import com.kitabqurdu.service.SavedFilterService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/filters")
public class SavedFilterController {

    @Autowired
    private SavedFilterService savedFilterService;

    @PostMapping
    public ResponseEntity<SavedFilter> createSavedFilter(
            @Valid @RequestBody SavedFilterRequest request,
            Authentication authentication) {
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        SavedFilter savedFilter = savedFilterService.createSavedFilter(userPrincipal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedFilter);
    }

    @GetMapping
    public ResponseEntity<List<SavedFilter>> getUserSavedFilters(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<SavedFilter> filters = savedFilterService.getUserSavedFilters(userPrincipal.getId());
        return ResponseEntity.ok(filters);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SavedFilter> getSavedFilterById(
            @PathVariable Long id,
            Authentication authentication) {
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        SavedFilter filter = savedFilterService.getSavedFilterById(id, userPrincipal.getId());
        return ResponseEntity.ok(filter);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SavedFilter> updateSavedFilter(
            @PathVariable Long id,
            @Valid @RequestBody SavedFilterRequest request,
            Authentication authentication) {
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        SavedFilter filter = savedFilterService.updateSavedFilter(id, userPrincipal.getId(), request);
        return ResponseEntity.ok(filter);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSavedFilter(
            @PathVariable Long id,
            Authentication authentication) {
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        savedFilterService.deleteSavedFilter(id, userPrincipal.getId());
        return ResponseEntity.noContent().build();
    }
}
