package com.ctgroup.security;

import com.ctgroup.entity.User;
import com.ctgroup.entity.UserRole;
import com.ctgroup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmailWithRoles(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        List<String> roles = user.getUserRoles().stream()
                .map(ur -> ur.getRole().getName())
                .collect(Collectors.toList());

        List<String> permissions = user.getUserRoles().stream()
                .flatMap(ur -> ur.getRole().getRolePermissions().stream())
                .map(rp -> rp.getPermission().getName())
                .distinct()
                .collect(Collectors.toList());

        return UserPrincipal.create(user, roles, permissions);
    }

    @Transactional(readOnly = true)
    public UserDetails loadUserById(String id) {
        User user = userRepository.findByIdWithRoles(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));

        List<String> roles = user.getUserRoles().stream()
                .map(ur -> ur.getRole().getName())
                .collect(Collectors.toList());

        List<String> permissions = user.getUserRoles().stream()
                .flatMap(ur -> ur.getRole().getRolePermissions().stream())
                .map(rp -> rp.getPermission().getName())
                .distinct()
                .collect(Collectors.toList());

        return UserPrincipal.create(user, roles, permissions);
    }
}
