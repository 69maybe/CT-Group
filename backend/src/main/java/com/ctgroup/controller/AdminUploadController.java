package com.ctgroup.controller;

import com.ctgroup.dto.response.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/uploads")
public class AdminUploadController {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @PostMapping("/image")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadImage(@RequestParam("file") MultipartFile file)
            throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        String originalName = file.getOriginalFilename();
        String extension = StringUtils.getFilenameExtension(originalName);
        String fileName = UUID.randomUUID() + (StringUtils.hasText(extension) ? "." + extension : "");

        Path targetDir = Paths.get(System.getProperty("user.dir"), uploadDir, "articles");
        Files.createDirectories(targetDir);

        Path targetPath = targetDir.resolve(fileName);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        String relativePath = "/uploads/articles/" + fileName;
        String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path(relativePath)
                .toUriString();

        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "url", imageUrl,
                "path", relativePath
        )));
    }
}
