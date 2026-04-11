package com.greenlife.service;

import com.greenlife.dto.response.PermissionResponse;
import com.greenlife.dto.response.RoleResponse;
import com.greenlife.entity.Permission;
import com.greenlife.entity.Role;
import com.greenlife.entity.UserRole;
import com.greenlife.exception.ResourceNotFoundException;
import com.greenlife.repository.PermissionRepository;
import com.greenlife.repository.RoleRepository;
import com.greenlife.repository.UserRepository;
import com.greenlife.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PermissionService {

    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;

    @Transactional(readOnly = true)
    public List<PermissionResponse> getAllPermissions() {
        return permissionRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Map<String, List<PermissionResponse>> getPermissionsGrouped() {
        List<Permission> permissions = permissionRepository.findAll();

        Map<String, List<PermissionResponse>> grouped = new HashMap<>();
        for (Permission permission : permissions) {
            grouped.computeIfAbsent(permission.getResource(), k -> new ArrayList<>())
                    .add(mapToResponse(permission));
        }

        return grouped;
    }

    @Transactional(readOnly = true)
    public List<String> getUserPermissions(String userId) {
        UserRole userRole = userRoleRepository.findByUserId(userId).stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("User has no roles"));

        return userRole.getRole().getRolePermissions().stream()
                .map(rp -> rp.getPermission().getName())
                .collect(Collectors.toList());
    }

    private PermissionResponse mapToResponse(Permission permission) {
        return PermissionResponse.builder()
                .id(permission.getId())
                .name(permission.getName())
                .description(permission.getDescription())
                .resource(permission.getResource())
                .action(permission.getAction())
                .build();
    }
}
