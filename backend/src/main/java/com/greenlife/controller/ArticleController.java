package com.greenlife.controller;

import com.greenlife.dto.response.ApiResponse;
import com.greenlife.dto.response.PageResponse;
import com.greenlife.dto.response.ArticleResponse;
import com.greenlife.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ArticleResponse>>> getArticles(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "vi") String locale) {

        PageResponse<ArticleResponse> response = articleService.getArticles(page, limit, category, search, locale);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<ArticleResponse>> getArticle(
            @PathVariable String slug,
            @RequestParam(required = false, defaultValue = "vi") String locale) {
        ArticleResponse response = articleService.getArticleBySlug(slug, locale);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<ArticleResponse>>> getFeaturedArticles(
            @RequestParam(required = false, defaultValue = "vi") String locale) {
        List<ArticleResponse> response = articleService.getFeaturedArticles(locale);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
