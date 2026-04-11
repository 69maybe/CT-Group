package com.greenlife.controller;

import com.greenlife.dto.request.AssignRolesRequest;
import com.greenlife.dto.request.UserUpdateRequest;
import com.greenlife.dto.response.ApiResponse;
import com.greenlife.dto.response.PageResponse;
import com.greenlife.dto.response.UserResponse;
import com.greenlife.security.UserPrincipal;
import com.greenlife.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> getUsers(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role) {

        PageResponse<UserResponse> response = userService.getUsers(page, limit, search, role);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> getUser(@PathVariable String id) {
        UserResponse response = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable String id,
            @Valid @RequestBody UserUpdateRequest request) {
        UserResponse response = userService.updateUser(id, request);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", response));
    }

    @PostMapping("/{id}/roles")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> assignRoles(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody AssignRolesRequest request) {
        
        // Check if trying to assign ADMIN or SUPER_ADMIN role
        boolean isPrivilegedRole = request.getRoleIds().stream()
                .anyMatch(roleId -> userService.isPrivilegedRole(roleId));
        
        if (isPrivilegedRole && !currentUser.getRoles().contains("SUPER_ADMIN")) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "Only SUPER_ADMIN can assign ADMIN or SUPER_ADMIN roles");
        }
        
        UserResponse response = userService.assignRoles(id, request);
        return ResponseEntity.ok(ApiResponse.success("Roles assigned successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }
}
