package com.ctgroup.service;

import com.ctgroup.dto.request.RoleRequest;
import com.ctgroup.dto.response.RoleResponse;
import com.ctgroup.entity.Permission;
import com.ctgroup.entity.Role;
import com.ctgroup.entity.RolePermission;
import com.ctgroup.exception.ConflictException;
import com.ctgroup.exception.ResourceNotFoundException;
import com.ctgroup.repository.PermissionRepository;
import com.ctgroup.repository.RoleRepository;
import com.ctgroup.repository.RolePermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final RolePermissionRepository rolePermissionRepository;

    @Transactional(readOnly = true)
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAllWithDetails().stream()
                .map(this::mapToResponseWithDetails)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RoleResponse getRoleById(String id) {
        Role role = roleRepository.findByIdWithPermissions(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + id));
        return mapToResponseWithDetails(role);
    }

    @Transactional
    public RoleResponse createRole(RoleRequest request) {
        if (roleRepository.existsByName(request.getName())) {
            throw new ConflictException("Role name already exists");
        }

        Role role = Role.builder()
                .name(request.getName())
                .description(request.getDescription())
                .isDefault(request.getIsDefault() != null ? request.getIsDefault() : false)
                .build();

        role = roleRepository.save(role);
        return mapToResponse(role);
    }

    @Transactional
    public RoleResponse updateRole(String id, RoleRequest request) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + id));

        if (request.getName() != null) {
            if (!role.getName().equals(request.getName()) && roleRepository.existsByName(request.getName())) {
                throw new ConflictException("Role name already exists");
            }
            role.setName(request.getName());
        }
        if (request.getDescription() != null) {
            role.setDescription(request.getDescription());
        }
        if (request.getIsDefault() != null) {
            role.setIsDefault(request.getIsDefault());
        }

        role = roleRepository.save(role);
        return mapToResponse(role);
    }

    @Transactional
    public void deleteRole(String id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + id));
        roleRepository.delete(role);
    }

    @Transactional
    public RoleResponse assignPermissions(String roleId, List<String> permissionIds) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleId));

        rolePermissionRepository.deleteByRoleId(roleId);

        for (String permissionId : permissionIds) {
            Permission permission = permissionRepository.findById(permissionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Permission not found: " + permissionId));

            RolePermission rolePermission = RolePermission.builder()
                    .role(role)
                    .permission(permission)
                    .build();

            rolePermissionRepository.save(rolePermission);
        }

        role = roleRepository.findByIdWithPermissions(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleId));

        return mapToResponseWithDetails(role);
    }

    private RoleResponse mapToResponse(Role role) {
        return RoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .description(role.getDescription())
                .isDefault(role.getIsDefault())
                .createdAt(role.getCreatedAt())
                .updatedAt(role.getUpdatedAt())
                .build();
    }
    
    private RoleResponse mapToResponseWithDetails(Role role) {
        List<String> permissions = role.getRolePermissions().stream()
                .map(rp -> rp.getPermission().getName())
                .collect(Collectors.toList());
        
        List<Map<String, Object>> rolePermissions = role.getRolePermissions().stream()
                .map(rp -> {
                    Map<String, Object> perm = new java.util.HashMap<>();
                    perm.put("id", rp.getPermission().getId());
                    perm.put("name", rp.getPermission().getName());
                    perm.put("description", rp.getPermission().getDescription());
                    return perm;
                })
                .collect(Collectors.toList());
        
        Map<String, Object> count = new java.util.HashMap<>();
        count.put("userRoles", role.getUserRoles().size());
        
        return RoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .description(role.getDescription())
                .isDefault(role.getIsDefault())
                .createdAt(role.getCreatedAt())
                .updatedAt(role.getUpdatedAt())
                .permissions(permissions)
                .rolePermissions(rolePermissions)
                ._count(count)
                .build();
    }
}
