package com.greenlife.controller;

import com.greenlife.dto.response.ApiResponse;
import com.greenlife.dto.response.PermissionResponse;
import com.greenlife.service.PermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
public class PermissionController {

    private final PermissionService permissionService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<PermissionResponse>>> getAllPermissions() {
        List<PermissionResponse> response = permissionService.getAllPermissions();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/grouped")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, List<PermissionResponse>>>> getPermissionsGrouped() {
        Map<String, List<PermissionResponse>> response = permissionService.getPermissionsGrouped();
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
