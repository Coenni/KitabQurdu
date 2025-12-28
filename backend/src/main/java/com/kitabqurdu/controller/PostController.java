package com.kitabqurdu.controller;

import com.kitabqurdu.dto.PostDto;
import com.kitabqurdu.dto.PostRequest;
import com.kitabqurdu.service.FileStorageService;
import com.kitabqurdu.service.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<Page<PostDto>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("ASC") ? 
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return ResponseEntity.ok(postService.getAllPosts(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<PostDto>> searchPosts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String condition,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("ASC") ? 
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return ResponseEntity.ok(postService.searchPosts(query, genre, city, minPrice, maxPrice, condition, pageable));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<PostDto>> getFeaturedPosts() {
        return ResponseEntity.ok(postService.getFeaturedPosts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDto> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @PostMapping
    public ResponseEntity<PostDto> createPost(@Valid @RequestBody PostRequest request, Authentication authentication) {
        return ResponseEntity.ok(postService.createPost(request, authentication));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostDto> updatePost(@PathVariable Long id, @Valid @RequestBody PostRequest request, 
                                              Authentication authentication) {
        return ResponseEntity.ok(postService.updatePost(id, request, authentication));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id, Authentication authentication) {
        postService.deletePost(id, authentication);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<PostDto>> getUserPosts(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(postService.getUserPosts(userId, pageable));
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<Map<String, Object>> uploadImages(
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files,
            Authentication authentication) {
        
        try {
            List<String> fileNames = fileStorageService.storeMultipleFiles(files);
            
            Map<String, Object> response = new HashMap<>();
            response.put("postId", id);
            response.put("uploadedFiles", fileNames);
            response.put("count", fileNames.size());
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to upload files");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid file");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}
