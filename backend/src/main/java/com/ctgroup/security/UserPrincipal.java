package com.ctgroup.security;

import com.ctgroup.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
public class UserPrincipal implements UserDetails {

    private String id;
    private String email;
    private String password;
    private boolean active;
    private List<String> roles;
    private List<String> permissions;

    public static UserPrincipal create(User user, List<String> roles, List<String> permissions) {
        return new UserPrincipal(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                user.getIsActive(),
                roles,
                permissions
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .flatMap(role -> {
                    if ("SUPER_ADMIN".equals(role)) {
                        return java.util.stream.Stream.of(
                                new SimpleGrantedAuthority("ROLE_" + role),
                                new SimpleGrantedAuthority("ROLE_ADMIN")
                        );
                    }
                    return java.util.stream.Stream.of(new SimpleGrantedAuthority("ROLE_" + role));
                })
                .collect(Collectors.toList());
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return active;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}
