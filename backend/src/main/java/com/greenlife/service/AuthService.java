package com.greenlife.service;

import com.greenlife.dto.request.LoginRequest;
import com.greenlife.dto.request.RefreshTokenRequest;
import com.greenlife.dto.request.RegisterRequest;
import com.greenlife.dto.response.AuthResponse;
import com.greenlife.dto.response.UserResponse;
import com.greenlife.entity.RefreshToken;
import com.greenlife.entity.Role;
import com.greenlife.entity.User;
import com.greenlife.entity.UserRole;
import com.greenlife.exception.ConflictException;
import com.greenlife.exception.UnauthorizedException;
import com.greenlife.repository.RefreshTokenRepository;
import com.greenlife.repository.RoleRepository;
import com.greenlife.repository.UserRepository;
import com.greenlife.security.JwtTokenProvider;
import com.greenlife.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .phone(request.getPhone())
                .isActive(true)
                .build();

        user = userRepository.save(user);

        Role defaultRole = roleRepository.findByName("CUSTOMER")
                .orElseGet(() -> roleRepository.findByIsDefaultTrue().stream().findFirst()
                        .orElse(null));

        if (defaultRole != null) {
            UserRole userRole = UserRole.builder()
                    .user(user)
                    .role(defaultRole)
                    .build();
            user.getUserRoles().add(userRole);
            userRepository.save(user);
        }

        return generateAuthResponse(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        // Update last login in a separate query to avoid entity state issues
        userRepository.findById(userPrincipal.getId()).ifPresent(user -> {
            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);
        });

        // Reload user with all relationships for token generation
        User user = userRepository.findByIdWithRoles(userPrincipal.getId())
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        return generateAuthResponse(user);
    }

    @Transactional
    public void logout(String userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (refreshToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new UnauthorizedException("Refresh token expired");
        }

        User user = refreshToken.getUser();
        refreshTokenRepository.delete(refreshToken);

        return generateAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String userId) {
        User user = userRepository.findByIdWithRoles(userId)
                .orElseThrow(() -> new UnauthorizedException("User not found"));
        return mapToUserResponse(user);
    }

    private AuthResponse generateAuthResponse(User user) {
        List<String> roles = user.getUserRoles().stream()
                .map(ur -> ur.getRole().getName())
                .collect(Collectors.toList());

        List<String> permissions = user.getUserRoles().stream()
                .flatMap(ur -> ur.getRole().getRolePermissions().stream())
                .map(rp -> rp.getPermission().getName())
                .distinct()
                .collect(Collectors.toList());

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), roles, permissions);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        RefreshToken token = RefreshToken.builder()
                .token(refreshToken)
                .user(user)
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();
        refreshTokenRepository.save(token);

        return AuthResponse.builder()
                .user(mapToUserResponse(user))
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .permissions(permissions)
                .build();
    }

    private UserResponse mapToUserResponse(User user) {
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
