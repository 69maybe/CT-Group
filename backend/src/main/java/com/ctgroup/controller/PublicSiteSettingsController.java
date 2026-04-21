package com.ctgroup.controller;

import com.ctgroup.dto.SiteSettingsDto;
import com.ctgroup.dto.response.ApiResponse;
import com.ctgroup.service.SettingService;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/settings")
@RequiredArgsConstructor
public class PublicSiteSettingsController {
    private static final String GROUP = "site";

    private final SettingService settingService;

    @GetMapping("/site")
    public ResponseEntity<ApiResponse<SiteSettingsDto.Response>> getSiteSettings() {
        var socialLinks = settingService
                .getJson(GROUP, "site.socialLinks", new TypeReference<List<SiteSettingsDto.SocialLink>>() {})
                .orElse(List.of());

        var bannerImages = settingService
                .getJson(GROUP, "site.bannerImages", new TypeReference<List<String>>() {})
                .orElse(List.of());

        var featuredImages = settingService
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
}

