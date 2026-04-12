package com.greenlife.controller;

import com.greenlife.dto.response.ApiResponse;
import com.greenlife.dto.response.BusinessSectorResponse;
import com.greenlife.service.BusinessSectorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/business-sectors")
@RequiredArgsConstructor
public class PublicBusinessSectorController {

    private final BusinessSectorService businessSectorService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BusinessSectorResponse>>> list(
            @RequestParam(required = false, defaultValue = "vi") String locale) {
        return ResponseEntity.ok(ApiResponse.success(businessSectorService.listPublic(locale)));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<BusinessSectorResponse>> getBySlug(
            @PathVariable String slug,
            @RequestParam(required = false, defaultValue = "vi") String locale) {
        return ResponseEntity.ok(ApiResponse.success(businessSectorService.getBySlug(slug, locale)));
    }
}
