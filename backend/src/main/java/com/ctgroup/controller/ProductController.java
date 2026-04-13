package com.ctgroup.controller;

import com.ctgroup.dto.response.ApiResponse;
import com.ctgroup.dto.response.PageResponse;
import com.ctgroup.dto.response.ProductResponse;
import com.ctgroup.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getProducts(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {

        PageResponse<ProductResponse> response = productService.getProducts(page, limit, category, search, sort, minPrice, maxPrice);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProduct(@PathVariable String slug) {
        ProductResponse response = productService.getProductBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getFeaturedProducts() {
        List<ProductResponse> response = productService.getFeaturedProducts();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/best-sellers")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getBestSellers() {
        List<ProductResponse> response = productService.getBestSellers();
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
