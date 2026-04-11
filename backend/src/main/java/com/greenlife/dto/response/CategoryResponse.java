package com.greenlife.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {

    private String id;

    private String name;

    private String slug;

    private String description;

    private String image;

    private String parentId;

    private String parentName;

    private Boolean isActive;

    private Integer sortOrder;

    private Set<CategoryResponse> children;

    private java.time.LocalDateTime createdAt;

    private java.time.LocalDateTime updatedAt;
}
