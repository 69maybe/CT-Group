package com.greenlife.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private String id;

    private String email;

    private String name;

    private String phone;

    private String address;

    private String avatar;

    private Boolean isActive;

    private LocalDateTime lastLoginAt;

    private LocalDateTime createdAt;

    private List<String> roles;

    private List<String> permissions;
}
