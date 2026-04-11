package com.greenlife.repository;

import com.greenlife.entity.Article;
import com.greenlife.entity.enums.ArticleCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, String>, JpaSpecificationExecutor<Article> {

    Optional<Article> findBySlug(String slug);

    boolean existsBySlug(String slug);

    Page<Article> findByIsPublishedTrue(Pageable pageable);

    Page<Article> findByCategoryAndIsPublishedTrue(ArticleCategory category, Pageable pageable);

    @Query("SELECT a FROM Article a WHERE a.isPublished = true AND a.isFeatured = true")
    List<Article> findFeaturedArticles();

    @Query("SELECT a FROM Article a WHERE a.isPublished = true ORDER BY a.viewCount DESC")
    List<Article> findMostViewed();
}
