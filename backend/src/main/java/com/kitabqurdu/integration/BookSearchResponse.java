package com.kitabqurdu.integration;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class BookSearchResponse {
    
    private List<BookResult> docs = new ArrayList<>();
    
    @Data
    public static class BookResult {
        private String title;
        private List<String> author_name;
        private String key;
        private Integer first_publish_year;
    }
}
