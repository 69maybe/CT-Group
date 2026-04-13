package com.ctgroup.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusinessSectorRequest {

    @NotBlank(message = "Slug is required")
    private String slug;

    @NotNull(message = "Sort order is required")
    private Integer sortOrder;

    @NotBlank(message = "Image path is required")
    private String imagePath;

    @NotBlank(message = "Vietnamese title is required")
    private String titleVi;

    @NotBlank(message = "English title is required")
    private String titleEn;

    private String subtitleVi;

    private String subtitleEn;

    private String descriptionVi;

    private String descriptionEn;

    @NotBlank(message = "Detail href is required")
    private String detailHref;

    private Boolean active;
}
