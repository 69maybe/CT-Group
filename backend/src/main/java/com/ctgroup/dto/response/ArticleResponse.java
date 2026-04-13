package com.ctgroup.dto.response;

import com.ctgroup.entity.enums.ArticleCategory;
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
public class ArticleResponse {

    private String id;

    private String title;

    private String titleEn;

    private String slug;

    private String excerpt;

    private String excerptEn;

    private String content;

    private String contentEn;

    private String image;

    private String author;

    private ArticleCategory category;

    private Set<String> tags;

    private Boolean isFeatured;

    private Boolean isPublished;

    private Integer viewCount;

    private String seoTitle;

    private String seoDesc;

    private LocalDateTime publishedAt;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
