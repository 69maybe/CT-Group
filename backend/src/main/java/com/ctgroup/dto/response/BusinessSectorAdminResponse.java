package com.ctgroup.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusinessSectorAdminResponse {
    private String id;
    private String slug;
    private Integer sortOrder;
    private String imagePath;
    private String titleVi;
    private String titleEn;
    private String subtitleVi;
    private String subtitleEn;
    private String descriptionVi;
    private String descriptionEn;
    private String detailHref;
    private Boolean active;
}
