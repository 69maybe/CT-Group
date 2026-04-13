package com.ctgroup.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusinessSectorResponse {

    private String id;

    private String slug;

    private int sortOrder;

    private String imagePath;

    private String title;

    private String subtitle;

    private String description;

    private String detailHref;
}
