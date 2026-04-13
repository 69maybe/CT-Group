package com.ctgroup.service;

import com.ctgroup.dto.request.ArticleRequest;
import com.ctgroup.dto.response.ArticleResponse;
import com.ctgroup.dto.response.PageResponse;
import com.ctgroup.entity.Article;
import com.ctgroup.entity.enums.ArticleCategory;
import com.ctgroup.exception.ConflictException;
import com.ctgroup.exception.ResourceNotFoundException;
import com.ctgroup.repository.ArticleRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;

    @Transactional(readOnly = true)
    public PageResponse<ArticleResponse> getArticles(Integer page, Integer limit, String category, String search, String locale) {
        Pageable pageable = PageRequest.of(
                page != null ? page - 1 : 0,
                limit != null ? limit : 20,
                Sort.by(Sort.Direction.DESC, "publishedAt")
        );

        Specification<Article> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isTrue(root.get("isPublished")));

            if (StringUtils.hasText(category)) {
                predicates.add(cb.equal(root.get("category"), ArticleCategory.valueOf(category.toUpperCase())));
            }

            if (StringUtils.hasText(search)) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), searchPattern),
                        cb.like(cb.lower(root.get("content")), searchPattern),
                        cb.like(cb.lower(root.get("titleEn")), searchPattern),
                        cb.like(cb.lower(root.get("contentEn")), searchPattern)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Article> articlePage = articleRepository.findAll(spec, pageable);

        List<ArticleResponse> articles = articlePage.getContent().stream()
                .map(article -> mapToResponse(article, locale))
                .collect(Collectors.toList());

        return PageResponse.of(articles, articlePage.getTotalElements(), page != null ? page : 1, limit != null ? limit : 20);
    }

    @Transactional(readOnly = true)
    public PageResponse<ArticleResponse> getAllArticles(Integer page, Integer limit, String category, String search) {
        Pageable pageable = PageRequest.of(
                page != null ? page - 1 : 0,
                limit != null ? limit : 100,
                Sort.by(Sort.Direction.DESC, "publishedAt")
        );

        Specification<Article> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(category)) {
                predicates.add(cb.equal(root.get("category"), ArticleCategory.valueOf(category.toUpperCase())));
            }

            if (StringUtils.hasText(search)) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), searchPattern),
                        cb.like(cb.lower(root.get("content")), searchPattern),
                        cb.like(cb.lower(root.get("titleEn")), searchPattern),
                        cb.like(cb.lower(root.get("contentEn")), searchPattern)
                ));
            }

            return predicates.isEmpty() ? cb.conjunction() : cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Article> articlePage = articleRepository.findAll(spec, pageable);

        List<ArticleResponse> articles = articlePage.getContent().stream()
                .map(article -> mapToResponse(article, "vi"))
                .collect(Collectors.toList());

        return PageResponse.of(articles, articlePage.getTotalElements(), page != null ? page : 1, limit != null ? limit : 100);
    }

    @Transactional(readOnly = true)
    public ArticleResponse getArticleBySlug(String slug, String locale) {
        Article article = articleRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found: " + slug));

        article.setViewCount(article.getViewCount() + 1);
        articleRepository.save(article);

        return mapToResponse(article, locale);
    }

    @Transactional(readOnly = true)
    public List<ArticleResponse> getFeaturedArticles(String locale) {
        return articleRepository.findFeaturedArticles().stream()
                .map(article -> mapToResponse(article, locale))
                .collect(Collectors.toList());
    }

    @Transactional
    public ArticleResponse createArticle(ArticleRequest request) {
        if (articleRepository.existsBySlug(generateSlug(request.getTitle()))) {
            throw new ConflictException("Article slug already exists");
        }

        Article article = Article.builder()
                .title(request.getTitle())
                .titleEn(request.getTitleEn())
                .slug(generateSlug(request.getTitle()))
                .content(request.getContent())
                .contentEn(request.getContentEn())
                .excerpt(request.getExcerpt())
                .excerptEn(request.getExcerptEn())
                .image(request.getImage())
                .author(request.getAuthor())
                .category(request.getCategory() != null ? request.getCategory() : ArticleCategory.NEWS)
                .tags(request.getTags())
                .isFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false)
                .isPublished(request.getIsPublished() != null ? request.getIsPublished() : true)
                .seoTitle(request.getSeoTitle())
                .seoDesc(request.getSeoDesc())
                .publishedAt(request.getPublishedAt() != null ? request.getPublishedAt() : LocalDateTime.now())
                .build();

        article = articleRepository.save(article);
        return mapToResponse(article, "vi");
    }

    @Transactional
    public ArticleResponse updateArticle(String id, ArticleRequest request) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found: " + id));

        if (request.getTitle() != null) {
            article.setTitle(request.getTitle());
            article.setSlug(generateSlug(request.getTitle()));
        }
        if (request.getTitleEn() != null) {
            article.setTitleEn(request.getTitleEn());
        }
        if (request.getContent() != null) {
            article.setContent(request.getContent());
        }
        if (request.getContentEn() != null) {
            article.setContentEn(request.getContentEn());
        }
        if (request.getExcerpt() != null) {
            article.setExcerpt(request.getExcerpt());
        }
        if (request.getExcerptEn() != null) {
            article.setExcerptEn(request.getExcerptEn());
        }
        if (request.getImage() != null) {
            article.setImage(request.getImage());
        }
        if (request.getAuthor() != null) {
            article.setAuthor(request.getAuthor());
        }
        if (request.getCategory() != null) {
            article.setCategory(request.getCategory());
        }
        if (request.getTags() != null) {
            article.setTags(request.getTags());
        }
        if (request.getIsFeatured() != null) {
            article.setIsFeatured(request.getIsFeatured());
        }
        if (request.getIsPublished() != null) {
            article.setIsPublished(request.getIsPublished());
        }
        if (request.getSeoTitle() != null) {
            article.setSeoTitle(request.getSeoTitle());
        }
        if (request.getSeoDesc() != null) {
            article.setSeoDesc(request.getSeoDesc());
        }
        if (request.getPublishedAt() != null) {
            article.setPublishedAt(request.getPublishedAt());
        }

        article = articleRepository.save(article);
        return mapToResponse(article, "vi");
    }

    @Transactional
    public void deleteArticle(String id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found: " + id));
        articleRepository.delete(article);
    }

    private String generateSlug(String title) {
        return title.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .trim();
    }

    private ArticleResponse mapToResponse(Article article, String locale) {
        boolean isEnglish = "en".equals(locale);
        
        return ArticleResponse.builder()
                .id(article.getId())
                .title(isEnglish && article.getTitleEn() != null ? article.getTitleEn() : article.getTitle())
                .titleEn(article.getTitleEn())
                .slug(article.getSlug())
                .excerpt(isEnglish && article.getExcerptEn() != null ? article.getExcerptEn() : article.getExcerpt())
                .excerptEn(article.getExcerptEn())
                .content(isEnglish && article.getContentEn() != null ? article.getContentEn() : article.getContent())
                .contentEn(article.getContentEn())
                .image(article.getImage())
                .author(article.getAuthor())
                .category(article.getCategory())
                .tags(article.getTags())
                .isFeatured(article.getIsFeatured())
                .isPublished(article.getIsPublished())
                .viewCount(article.getViewCount())
                .seoTitle(article.getSeoTitle())
                .seoDesc(article.getSeoDesc())
                .publishedAt(article.getPublishedAt())
                .createdAt(article.getCreatedAt())
                .updatedAt(article.getUpdatedAt())
                .build();
    }
}
