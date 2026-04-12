package com.greenlife.service;

import com.greenlife.dto.response.BusinessSectorResponse;
import com.greenlife.entity.BusinessSector;
import com.greenlife.exception.ResourceNotFoundException;
import com.greenlife.repository.BusinessSectorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BusinessSectorService {

    private final BusinessSectorRepository businessSectorRepository;

    @Transactional(readOnly = true)
    public List<BusinessSectorResponse> listPublic(String locale) {
        return businessSectorRepository.findByActiveTrueOrderBySortOrderAsc().stream()
                .map(s -> map(s, locale))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BusinessSectorResponse getBySlug(String slug, String locale) {
        BusinessSector s = businessSectorRepository.findBySlugAndActiveTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Business sector not found: " + slug));
        return map(s, locale);
    }

    private BusinessSectorResponse map(BusinessSector s, String locale) {
        boolean en = "en".equalsIgnoreCase(locale);
        return BusinessSectorResponse.builder()
                .id(s.getId())
                .slug(s.getSlug())
                .sortOrder(s.getSortOrder())
                .imagePath(s.getImagePath())
                .title(en ? s.getTitleEn() : s.getTitleVi())
                .subtitle(en ? nullToEmpty(s.getSubtitleEn()) : nullToEmpty(s.getSubtitleVi()))
                .description(en ? nullToEmpty(s.getDescriptionEn()) : nullToEmpty(s.getDescriptionVi()))
                .detailHref(s.getDetailHref())
                .build();
    }

    private static String nullToEmpty(String v) {
        return v != null ? v : "";
    }
}
