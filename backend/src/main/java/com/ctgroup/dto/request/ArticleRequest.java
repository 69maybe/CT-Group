package com.ctgroup.dto.request;

import com.ctgroup.entity.enums.ArticleCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArticleRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 2, max = 200, message = "Title must be between 2 and 200 characters")
    private String title;

    private String titleEn;

    @NotBlank(message = "Content is required")
    private String content;

    private String contentEn;

    private String excerpt;

    private String excerptEn;

    private String image;

    private String author;

    private ArticleCategory category;

    private Set<String> tags;

    private Boolean isFeatured;

    private Boolean isPublished;

    private String seoTitle;

    private String seoDesc;

    private LocalDateTime publishedAt;
}
