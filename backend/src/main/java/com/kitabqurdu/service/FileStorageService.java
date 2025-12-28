package com.kitabqurdu.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Value("${file.max-file-size:5242880}") // 5MB default
    private long maxFileSize;

    private final List<String> allowedExtensions = List.of("jpg", "jpeg", "png", "gif", "webp");

    public String storeFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot store empty file");
        }

        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new IllegalArgumentException("File must have a name");
        }

        String fileExtension = getFileExtension(originalFilename);
        if (!allowedExtensions.contains(fileExtension.toLowerCase())) {
            throw new IllegalArgumentException("File type not allowed. Allowed types: " + allowedExtensions);
        }

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String fileName = UUID.randomUUID().toString() + "." + fileExtension;
        Path targetLocation = uploadPath.resolve(fileName);

        // Copy file to target location
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }

    public List<String> storeMultipleFiles(List<MultipartFile> files) throws IOException {
        List<String> fileNames = new ArrayList<>();
        
        if (files == null || files.isEmpty()) {
            return fileNames;
        }

        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                String fileName = storeFile(file);
                fileNames.add(fileName);
            }
        }

        return fileNames;
    }

    public void deleteFile(String fileName) throws IOException {
        if (fileName == null || fileName.trim().isEmpty()) {
            return;
        }

        Path filePath = Paths.get(uploadDir).resolve(fileName);
        Files.deleteIfExists(filePath);
    }

    public void deleteMultipleFiles(List<String> fileNames) throws IOException {
        if (fileNames == null || fileNames.isEmpty()) {
            return;
        }

        for (String fileName : fileNames) {
            deleteFile(fileName);
        }
    }

    public Path getFilePath(String fileName) {
        return Paths.get(uploadDir).resolve(fileName);
    }

    private String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return "";
        }
        return fileName.substring(lastDotIndex + 1);
    }
}
