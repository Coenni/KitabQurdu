package com.kitabqurdu.integration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookApiService {

    private static final Logger logger = LoggerFactory.getLogger(BookApiService.class);
    private static final String OPEN_LIBRARY_API = "https://openlibrary.org/search.json";

    private final WebClient webClient;

    public BookApiService() {
        this.webClient = WebClient.builder()
                .baseUrl(OPEN_LIBRARY_API)
                .build();
    }

    @Cacheable(value = "books", key = "#query")
    public List<String> searchBooks(String query) {
        try {
            BookSearchResponse response = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .queryParam("title", query)
                            .queryParam("limit", 10)
                            .build())
                    .retrieve()
                    .bodyToMono(BookSearchResponse.class)
                    .onErrorResume(e -> {
                        logger.error("Error searching books: {}", e.getMessage());
                        return Mono.just(new BookSearchResponse());
                    })
                    .block();

            if (response != null && response.getDocs() != null) {
                return response.getDocs().stream()
                        .map(BookSearchResponse.BookResult::getTitle)
                        .distinct()
                        .limit(10)
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            logger.error("Failed to search books", e);
        }

        return new ArrayList<>();
    }

    @Cacheable(value = "authors", key = "#query")
    public List<String> searchAuthors(String query) {
        try {
            BookSearchResponse response = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .queryParam("author", query)
                            .queryParam("limit", 10)
                            .build())
                    .retrieve()
                    .bodyToMono(BookSearchResponse.class)
                    .onErrorResume(e -> {
                        logger.error("Error searching authors: {}", e.getMessage());
                        return Mono.just(new BookSearchResponse());
                    })
                    .block();

            if (response != null && response.getDocs() != null) {
                return response.getDocs().stream()
                        .filter(doc -> doc.getAuthor_name() != null && !doc.getAuthor_name().isEmpty())
                        .flatMap(doc -> doc.getAuthor_name().stream())
                        .distinct()
                        .limit(10)
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            logger.error("Failed to search authors", e);
        }

        return new ArrayList<>();
    }
}
