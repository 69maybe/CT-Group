package com.ctgroup.controller;

import com.ctgroup.dto.request.LoginRequest;
import com.ctgroup.dto.request.RefreshTokenRequest;
import com.ctgroup.dto.request.RegisterRequest;
import com.ctgroup.dto.request.UserProfileUpdateRequest;
import com.ctgroup.dto.response.ApiResponse;
import com.ctgroup.dto.response.AuthResponse;
import com.ctgroup.dto.response.UserResponse;
import com.ctgroup.exception.UnauthorizedException;
import com.ctgroup.security.UserPrincipal;
import com.ctgroup.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    @org.springframework.beans.factory.annotation.Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success("Registration successful", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@AuthenticationPrincipal UserPrincipal currentUser) {
        if (currentUser != null) {
            authService.logout(currentUser.getId());
        }
        return ResponseEntity.ok(ApiResponse.success("Logout successful", null));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(@AuthenticationPrincipal UserPrincipal currentUser) {
        if (currentUser == null) {
            throw new UnauthorizedException("Unauthorized");
        }
        UserResponse response = authService.getCurrentUser(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateCurrentUser(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody UserProfileUpdateRequest request) {
        if (currentUser == null) {
            throw new UnauthorizedException("Unauthorized");
        }
        UserResponse response = authService.updateCurrentUser(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @PostMapping("/upload-avatar")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadAvatar(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam("file") MultipartFile file) throws IOException {
        if (currentUser == null) {
            throw new UnauthorizedException("Unauthorized");
        }
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String fileName = UUID.randomUUID() + (StringUtils.hasText(extension) ? "." + extension : "");

        Path targetDir = Paths.get(System.getProperty("user.dir"), uploadDir, "avatars");
        Files.createDirectories(targetDir);
        Files.copy(file.getInputStream(), targetDir.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);

        String relativePath = "/uploads/avatars/" + fileName;
        String url = ServletUriComponentsBuilder.fromCurrentContextPath().path(relativePath).toUriString();
        return ResponseEntity.ok(ApiResponse.success(Map.of("path", relativePath, "url", url)));
    }
}
