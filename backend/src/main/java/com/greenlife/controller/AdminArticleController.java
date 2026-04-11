package com.greenlife.controller;

import com.greenlife.dto.request.ArticleRequest;
import com.greenlife.dto.response.ApiResponse;
import com.greenlife.dto.response.ArticleResponse;
import com.greenlife.dto.response.PageResponse;
import com.greenlife.service.ArticleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/articles")
@RequiredArgsConstructor
public class AdminArticleController {

    private final ArticleService articleService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<PageResponse<ArticleResponse>>> getAllArticles(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean includeUnpublished) {
        PageResponse<ArticleResponse> response;
        if (includeUnpublished != null && includeUnpublished) {
            response = articleService.getAllArticles(page, limit, category, search);
        } else {
            response = articleService.getArticles(page, limit, category, search, null);
        }
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<ArticleResponse>> createArticle(@Valid @RequestBody ArticleRequest request) {
        ArticleResponse response = articleService.createArticle(request);
        return ResponseEntity.ok(ApiResponse.success("Article created successfully", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<ArticleResponse>> updateArticle(
            @PathVariable String id,
            @Valid @RequestBody ArticleRequest request) {
        ArticleResponse response = articleService.updateArticle(id, request);
        return ResponseEntity.ok(ApiResponse.success("Article updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteArticle(@PathVariable String id) {
        articleService.deleteArticle(id);
        return ResponseEntity.ok(ApiResponse.success("Article deleted successfully", null));
    }
}
