package com.greenlife.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "business_sectors", indexes = {
        @Index(name = "idx_business_sectors_active_sort", columnList = "active,sort_order")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusinessSector extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    /** Public path under frontend /public e.g. /images/ctgroup/KV_Nganh-1.png */
    @Column(name = "image_path", nullable = false)
    private String imagePath;

    @Column(name = "title_vi", nullable = false, columnDefinition = "TEXT")
    private String titleVi;

    @Column(name = "title_en", nullable = false, columnDefinition = "TEXT")
    private String titleEn;

    @Column(name = "subtitle_vi")
    private String subtitleVi;

    @Column(name = "subtitle_en")
    private String subtitleEn;

    @Column(name = "description_vi", columnDefinition = "TEXT")
    private String descriptionVi;

    @Column(name = "description_en", columnDefinition = "TEXT")
    private String descriptionEn;

    /** Relative path for Next.js app e.g. /business-sector/smart-city */
    @Column(name = "detail_href", nullable = false)
    private String detailHref;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;
}
