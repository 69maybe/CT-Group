package com.greenlife.service;

import com.greenlife.dto.request.AssignRolesRequest;
import com.greenlife.dto.request.UserUpdateRequest;
import com.greenlife.dto.response.PageResponse;
import com.greenlife.dto.response.UserResponse;
import com.greenlife.entity.Role;
import com.greenlife.entity.User;
import com.greenlife.entity.UserRole;
import com.greenlife.exception.ResourceNotFoundException;
import com.greenlife.repository.RoleRepository;
import com.greenlife.repository.UserRepository;
import com.greenlife.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getUsers(Integer page, Integer limit, String search, String role) {
        int pageNum = page != null ? page - 1 : 0;
        int size = limit != null ? limit : 20;

        // Get all users with roles first (for proper role loading)
        List<User> allUsers = userRepository.findAllWithRoles();
        
        // Apply search filter if needed
        if (StringUtils.hasText(search)) {
            String searchLower = search.toLowerCase();
            allUsers = allUsers.stream()
                    .filter(u -> (u.getName() != null && u.getName().toLowerCase().contains(searchLower))
                            || (u.getEmail() != null && u.getEmail().toLowerCase().contains(searchLower)))
                    .collect(Collectors.toList());
        }
        
        // Apply pagination
        int total = allUsers.size();
        int start = pageNum * size;
        int end = Math.min(start + size, total);
        List<User> pagedUsers = start < total ? allUsers.subList(start, end) : List.of();

        List<UserResponse> users = pagedUsers.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PageResponse.of(users, total, pageNum + 1, size);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(String id) {
        User user = userRepository.findByIdWithRoles(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        return mapToResponse(user);
    }

    @Transactional
    public UserResponse updateUser(String id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }

        user = userRepository.save(user);
        return mapToResponse(user);
    }

    @Transactional
    public UserResponse assignRoles(String userId, AssignRolesRequest request) {
        // First clear existing roles
        userRoleRepository.deleteByUserId(userId);
        
        // Reload user in this transaction
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        // Clear the set to avoid conflicts
        user.getUserRoles().clear();
        
        for (String roleId : request.getRoleIds()) {
            Role role = roleRepository.findById(roleId)
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleId));

            UserRole userRole = UserRole.builder()
                    .user(user)
                    .role(role)
                    .build();

            user.getUserRoles().add(userRole);
        }

        user = userRepository.save(user);
        
        // Return fresh data with roles loaded
        return mapToResponse(user);
    }

    @Transactional
    public void deleteUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        userRepository.delete(user);
    }

    @Transactional(readOnly = true)
    public boolean isPrivilegedRole(String roleId) {
        return roleRepository.findById(roleId)
                .map(role -> {
                    String roleName = role.getName();
                    return "ADMIN".equals(roleName) || "SUPER_ADMIN".equals(roleName);
                })
                .orElse(false);
    }

    private UserResponse mapToResponse(User user) {
        List<String> roles = user.getUserRoles().stream()
                .map(ur -> ur.getRole().getName())
                .collect(Collectors.toList());

        List<String> permissions = user.getUserRoles().stream()
                .flatMap(ur -> ur.getRole().getRolePermissions().stream())
                .map(rp -> rp.getPermission().getName())
                .distinct()
                .collect(Collectors.toList());

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .phone(user.getPhone())
                .address(user.getAddress())
                .avatar(user.getAvatar())
                .isActive(user.getIsActive())
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .roles(roles)
                .permissions(permissions)
                .build();
    }
}
