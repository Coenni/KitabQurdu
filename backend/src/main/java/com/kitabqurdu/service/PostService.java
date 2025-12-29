package com.kitabqurdu.service;

import com.kitabqurdu.dto.PostDto;
import com.kitabqurdu.dto.PostRequest;
import com.kitabqurdu.dto.UserDto;
import com.kitabqurdu.model.Post;
import com.kitabqurdu.model.User;
import com.kitabqurdu.repository.PostRepository;
import com.kitabqurdu.repository.UserRepository;
import com.kitabqurdu.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Cacheable(value = "posts", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<PostDto> getAllPosts(Pageable pageable) {
        return postRepository.findByStatus(Post.Status.ACTIVE, pageable)
                .map(this::convertToDto);
    }

    public Page<PostDto> searchPosts(String query, String genre, String city, 
                                     BigDecimal minPrice, BigDecimal maxPrice, 
                                     String condition, Pageable pageable) {
        Specification<Post> spec = Specification.where(null);

        spec = spec.and((root, cq, cb) -> cb.equal(root.get("status"), Post.Status.ACTIVE));

        if (query != null && !query.isEmpty()) {
            spec = spec.and((root, cq, cb) -> cb.or(
                cb.like(cb.lower(root.get("title")), "%" + query.toLowerCase() + "%"),
                cb.like(cb.lower(root.get("description")), "%" + query.toLowerCase() + "%"),
                cb.like(cb.lower(root.get("authorName")), "%" + query.toLowerCase() + "%"),
                cb.like(cb.lower(root.get("bookTitle")), "%" + query.toLowerCase() + "%")
            ));
        }

        if (genre != null && !genre.isEmpty()) {
            spec = spec.and((root, cq, cb) -> cb.equal(root.get("genre"), genre));
        }

        if (city != null && !city.isEmpty()) {
            spec = spec.and((root, cq, cb) -> cb.equal(root.get("city"), city));
        }

        if (minPrice != null) {
            spec = spec.and((root, cq, cb) -> cb.greaterThanOrEqualTo(root.get("price"), minPrice));
        }

        if (maxPrice != null) {
            spec = spec.and((root, cq, cb) -> cb.lessThanOrEqualTo(root.get("price"), maxPrice));
        }

        if (condition != null && !condition.isEmpty()) {
            spec = spec.and((root, cq, cb) -> cb.equal(root.get("condition"), Post.Condition.valueOf(condition)));
        }

        return postRepository.findAll(spec, pageable).map(this::convertToDto);
    }

    public PostDto getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return convertToDto(post);
    }

    @Transactional
    public PostDto createPost(PostRequest request, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = new Post();
        post.setUser(user);
        post.setTitle(request.getTitle());
        post.setDescription(request.getDescription());
        post.setAuthorName(request.getAuthorName());
        post.setBookTitle(request.getBookTitle());
        post.setGenre(request.getGenre());
        post.setPrice(request.getPrice());
        post.setCondition(Post.Condition.valueOf(request.getCondition()));
        post.setCity(request.getCity());
        post.setArea(request.getArea());
        post.setContactPhone(request.getContactPhone());
        post.setContactEmail(request.getContactEmail());
        post.setImages(request.getImages());
        post.setStatus(Post.Status.ACTIVE);

        post = postRepository.save(post);
        return convertToDto(post);
    }

    @Transactional
    public PostDto updatePost(Long id, PostRequest request, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getId().equals(userPrincipal.getId())) {
            throw new RuntimeException("You don't have permission to update this post");
        }

        post.setTitle(request.getTitle());
        post.setDescription(request.getDescription());
        post.setAuthorName(request.getAuthorName());
        post.setBookTitle(request.getBookTitle());
        post.setGenre(request.getGenre());
        post.setPrice(request.getPrice());
        post.setCondition(Post.Condition.valueOf(request.getCondition()));
        post.setCity(request.getCity());
        post.setArea(request.getArea());
        post.setContactPhone(request.getContactPhone());
        post.setContactEmail(request.getContactEmail());
        post.setImages(request.getImages());

        post = postRepository.save(post);
        return convertToDto(post);
    }

    @Transactional
    public void deletePost(Long id, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getId().equals(userPrincipal.getId())) {
            throw new RuntimeException("You don't have permission to delete this post");
        }

        post.setStatus(Post.Status.ARCHIVED);
        postRepository.save(post);
    }

    public Page<PostDto> getUserPosts(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return postRepository.findByUser(user, pageable).map(this::convertToDto);
    }

    public List<PostDto> getFeaturedPosts() {
        return postRepository.findTop10ByStatusOrderByCreatedAtDesc(Post.Status.ACTIVE)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private PostDto convertToDto(Post post) {
        PostDto dto = new PostDto();
        dto.setId(post.getId());
        dto.setUser(convertUserToDto(post.getUser()));
        dto.setTitle(post.getTitle());
        dto.setDescription(post.getDescription());
        dto.setAuthorName(post.getAuthorName());
        dto.setBookTitle(post.getBookTitle());
        dto.setGenre(post.getGenre());
        dto.setPrice(post.getPrice());
        dto.setCondition(post.getCondition().name());
        dto.setCity(post.getCity());
        dto.setArea(post.getArea());
        dto.setContactPhone(post.getContactPhone());
        dto.setContactEmail(post.getContactEmail());
        dto.setImages(post.getImages());
        dto.setStatus(post.getStatus().name());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        return dto;
    }

    private UserDto convertUserToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setImageUrl(user.getImageUrl());
        return dto;
    }
}
