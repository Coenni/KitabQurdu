package com.kitabqurdu.controller;

import com.kitabqurdu.integration.BookApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/autocomplete")
public class AutocompleteController {

    @Autowired
    private BookApiService bookApiService;

    @GetMapping("/books")
    public ResponseEntity<List<String>> searchBooks(@RequestParam String q) {
        return ResponseEntity.ok(bookApiService.searchBooks(q));
    }

    @GetMapping("/authors")
    public ResponseEntity<List<String>> searchAuthors(@RequestParam String q) {
        return ResponseEntity.ok(bookApiService.searchAuthors(q));
    }
}
