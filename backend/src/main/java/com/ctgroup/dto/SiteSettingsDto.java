package com.ctgroup.dto;

import java.util.List;

public class SiteSettingsDto {
    public record SocialLink(String href, String icon, String label) {}

    public record Response(
            String logoPath,
            String bannerPath,
            List<String> bannerImages,
            List<String> featuredImages,
            String phone,
            String email,
            String addressVi,
            String addressEn,
            String introTitle,
            String introSloganVi,
            String introSloganEn,
            String introDescriptionVi,
            String introDescriptionEn,
            String introDescription2Vi,
            String introDescription2En,
            String introDescription3Vi,
            String introDescription3En,
            String introContentVi,
            String introContentEn,
            List<SocialLink> socialLinks
    ) {}

    public record Request(
            String logoPath,
            String bannerPath,
            List<String> bannerImages,
            List<String> featuredImages,
            String phone,
            String email,
            String addressVi,
            String addressEn,
            String introTitle,
            String introSloganVi,
            String introSloganEn,
            String introDescriptionVi,
            String introDescriptionEn,
            String introDescription2Vi,
            String introDescription2En,
            String introDescription3Vi,
            String introDescription3En,
            String introContentVi,
            String introContentEn,
            List<SocialLink> socialLinks
    ) {}
}

