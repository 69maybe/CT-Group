package com.ctgroup.controller;

import com.ctgroup.dto.SiteSettingsDto;
import com.ctgroup.dto.response.ApiResponse;
import com.ctgroup.service.SettingService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/settings")
@RequiredArgsConstructor
public class AdminSiteSettingsController {
    private static final String GROUP = "site";

    private final SettingService settingService;
    private final ObjectMapper objectMapper;

    @GetMapping("/site")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<SiteSettingsDto.Response>> get() {
        // reuse public logic by delegating to storage
        List<SiteSettingsDto.SocialLink> socialLinks;
        try {
            socialLinks = settingService
                    .getJson(GROUP, "site.socialLinks", new com.fasterxml.jackson.core.type.TypeReference<List<SiteSettingsDto.SocialLink>>() {})
                    .orElse(List.of());
        } catch (Exception e) {
            socialLinks = List.of();
        }

        List<String> bannerImages = settingService
                .getJson(GROUP, "site.bannerImages", new TypeReference<List<String>>() {})
                .orElse(List.of());

        List<String> featuredImages = settingService
                .getJson(GROUP, "site.featuredImages", new TypeReference<List<String>>() {})
                .orElse(List.of());

        SiteSettingsDto.Response res = new SiteSettingsDto.Response(
                settingService.getString(GROUP, "site.logoPath").orElse(null),
                settingService.getString(GROUP, "site.bannerPath").orElse(null),
                bannerImages,
                featuredImages,
                settingService.getString(GROUP, "site.phone").orElse(null),
                settingService.getString(GROUP, "site.email").orElse(null),
                settingService.getString(GROUP, "site.addressVi").orElse(null),
                settingService.getString(GROUP, "site.addressEn").orElse(null),
                settingService.getString(GROUP, "site.introTitle").orElse(null),
                settingService.getString(GROUP, "site.introSloganVi").orElse(null),
                settingService.getString(GROUP, "site.introSloganEn").orElse(null),
                settingService.getString(GROUP, "site.introDescriptionVi").orElse(null),
                settingService.getString(GROUP, "site.introDescriptionEn").orElse(null),
                settingService.getString(GROUP, "site.introDescription2Vi").orElse(null),
                settingService.getString(GROUP, "site.introDescription2En").orElse(null),
                settingService.getString(GROUP, "site.introDescription3Vi").orElse(null),
                settingService.getString(GROUP, "site.introDescription3En").orElse(null),
                settingService.getString(GROUP, "site.introContentVi").orElse(null),
                settingService.getString(GROUP, "site.introContentEn").orElse(null),
                socialLinks
        );
        return ResponseEntity.ok(ApiResponse.success(res));
    }

    @PutMapping("/site")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<SiteSettingsDto.Response>> upsert(@RequestBody SiteSettingsDto.Request req) throws Exception {
        settingService.upsert(GROUP, "site.logoPath", "string", req.logoPath());
        settingService.upsert(GROUP, "site.bannerPath", "string", req.bannerPath());
        settingService.upsert(GROUP, "site.phone", "string", req.phone());
        settingService.upsert(GROUP, "site.email", "string", req.email());
        settingService.upsert(GROUP, "site.addressVi", "string", req.addressVi());
        settingService.upsert(GROUP, "site.addressEn", "string", req.addressEn());
        settingService.upsert(GROUP, "site.introTitle", "string", req.introTitle());
        settingService.upsert(GROUP, "site.introSloganVi", "string", req.introSloganVi());
        settingService.upsert(GROUP, "site.introSloganEn", "string", req.introSloganEn());
        settingService.upsert(GROUP, "site.introDescriptionVi", "string", req.introDescriptionVi());
        settingService.upsert(GROUP, "site.introDescriptionEn", "string", req.introDescriptionEn());
        settingService.upsert(GROUP, "site.introDescription2Vi", "string", req.introDescription2Vi());
        settingService.upsert(GROUP, "site.introDescription2En", "string", req.introDescription2En());
        settingService.upsert(GROUP, "site.introDescription3Vi", "string", req.introDescription3Vi());
        settingService.upsert(GROUP, "site.introDescription3En", "string", req.introDescription3En());
        settingService.upsert(GROUP, "site.introContentVi", "string", req.introContentVi());
        settingService.upsert(GROUP, "site.introContentEn", "string", req.introContentEn());

        String bannerJson = objectMapper.writeValueAsString(req.bannerImages() == null ? List.of() : req.bannerImages());
        settingService.upsert(GROUP, "site.bannerImages", "json", bannerJson);

        String featuredJson = objectMapper.writeValueAsString(req.featuredImages() == null ? List.of() : req.featuredImages());
        settingService.upsert(GROUP, "site.featuredImages", "json", featuredJson);

        String socialJson = objectMapper.writeValueAsString(req.socialLinks() == null ? List.of() : req.socialLinks());
        settingService.upsert(GROUP, "site.socialLinks", "json", socialJson);

        // return updated snapshot
        return get();
    }
}

