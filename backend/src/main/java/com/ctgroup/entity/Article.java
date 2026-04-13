package com.ctgroup.entity;

import com.ctgroup.entity.enums.ArticleCategory;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "articles", indexes = {
    @Index(name = "idx_articles_slug", columnList = "slug"),
    @Index(name = "idx_articles_category", columnList = "category"),
    @Index(name = "idx_articles_is_published", columnList = "is_published"),
    @Index(name = "idx_articles_published_at", columnList = "published_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Article extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Column(unique = true, nullable = false)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String excerpt;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    // English translations
    @Column(name = "title_en")
    private String titleEn;

    @Column(name = "excerpt_en", columnDefinition = "TEXT")
    private String excerptEn;

    @Column(name = "content_en", columnDefinition = "TEXT")
    private String contentEn;

    @Column(columnDefinition = "TEXT")
    private String image;

    private String author;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "category")
    private ArticleCategory category = ArticleCategory.NEWS;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "article_tags", joinColumns = @JoinColumn(name = "article_id"))
    @Column(name = "tag")
    @Builder.Default
    private Set<String> tags = new HashSet<>();

    @Builder.Default
    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @Builder.Default
    @Column(name = "is_published")
    private Boolean isPublished = true;

    @Builder.Default
    @Column(name = "view_count")
    private Integer viewCount = 0;

    @Column(name = "seo_title")
    private String seoTitle;

    @Column(name = "seo_desc", columnDefinition = "TEXT")
    private String seoDesc;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;
}
