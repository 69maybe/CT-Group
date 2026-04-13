package com.ctgroup.service;

import com.ctgroup.dto.request.BusinessSectorRequest;
import com.ctgroup.dto.response.BusinessSectorAdminResponse;
import com.ctgroup.dto.response.BusinessSectorResponse;
import com.ctgroup.entity.BusinessSector;
import com.ctgroup.exception.ConflictException;
import com.ctgroup.exception.ResourceNotFoundException;
import com.ctgroup.repository.BusinessSectorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BusinessSectorService {

    private final BusinessSectorRepository businessSectorRepository;

    @Transactional(readOnly = true)
    public List<BusinessSectorResponse> listPublic(String locale) {
        return businessSectorRepository.findAllByOrderBySortOrderAsc().stream()
                .map(s -> map(s, locale))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BusinessSectorAdminResponse> listAll() {
        return businessSectorRepository.findAll().stream()
                .sorted((a, b) -> Integer.compare(a.getSortOrder(), b.getSortOrder()))
                .map(this::mapAdmin)
                .collect(Collectors.toList());
    }

    @Transactional
    public BusinessSectorAdminResponse create(BusinessSectorRequest request) {
        String slug = normalizeSlug(request.getSlug());
        businessSectorRepository.findBySlug(slug)
                .ifPresent(existing -> {
                    throw new ConflictException("Business sector slug already exists");
                });

        BusinessSector sector = BusinessSector.builder()
                .slug(slug)
                .sortOrder(request.getSortOrder())
                .imagePath(request.getImagePath().trim())
                .titleVi(request.getTitleVi().trim())
                .titleEn(request.getTitleEn().trim())
                .subtitleVi(request.getSubtitleVi())
                .subtitleEn(request.getSubtitleEn())
                .descriptionVi(request.getDescriptionVi())
                .descriptionEn(request.getDescriptionEn())
                .detailHref(normalizeDetailHref(request.getDetailHref(), slug))
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        sector = businessSectorRepository.save(sector);
        return mapAdmin(sector);
    }

    @Transactional
    public BusinessSectorAdminResponse update(String id, BusinessSectorRequest request) {
        BusinessSector sector = businessSectorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Business sector not found: " + id));

        if (request.getSlug() != null) {
            String slug = normalizeSlug(request.getSlug());
            businessSectorRepository.findBySlug(slug)
                    .filter(existing -> !existing.getId().equals(id))
                    .ifPresent(existing -> {
                        throw new ConflictException("Business sector slug already exists");
                    });
            sector.setSlug(slug);
        }
        if (request.getSortOrder() != null) sector.setSortOrder(request.getSortOrder());
        if (request.getImagePath() != null) sector.setImagePath(request.getImagePath().trim());
        if (request.getTitleVi() != null) sector.setTitleVi(request.getTitleVi().trim());
        if (request.getTitleEn() != null) sector.setTitleEn(request.getTitleEn().trim());
        if (request.getSubtitleVi() != null) sector.setSubtitleVi(request.getSubtitleVi());
        if (request.getSubtitleEn() != null) sector.setSubtitleEn(request.getSubtitleEn());
        if (request.getDescriptionVi() != null) sector.setDescriptionVi(request.getDescriptionVi());
        if (request.getDescriptionEn() != null) sector.setDescriptionEn(request.getDescriptionEn());
        if (request.getDetailHref() != null || request.getSlug() != null) {
            sector.setDetailHref(normalizeDetailHref(request.getDetailHref(), sector.getSlug()));
        }
        if (request.getActive() != null) sector.setActive(request.getActive());

        sector = businessSectorRepository.save(sector);
        return mapAdmin(sector);
    }

    @Transactional
    public void delete(String id) {
        BusinessSector sector = businessSectorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Business sector not found: " + id));
        businessSectorRepository.delete(sector);
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

    private BusinessSectorAdminResponse mapAdmin(BusinessSector s) {
        return BusinessSectorAdminResponse.builder()
                .id(s.getId())
                .slug(s.getSlug())
                .sortOrder(s.getSortOrder())
                .imagePath(s.getImagePath())
                .titleVi(s.getTitleVi())
                .titleEn(s.getTitleEn())
                .subtitleVi(s.getSubtitleVi())
                .subtitleEn(s.getSubtitleEn())
                .descriptionVi(s.getDescriptionVi())
                .descriptionEn(s.getDescriptionEn())
                .detailHref(s.getDetailHref())
                .active(s.getActive())
                .build();
    }

    private static String nullToEmpty(String v) {
        return v != null ? v : "";
    }

    private String normalizeSlug(String raw) {
        return raw == null
                ? ""
                : raw.trim()
                .toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");
    }

    private String normalizeDetailHref(String rawHref, String slug) {
        if (StringUtils.hasText(rawHref)) {
            String href = rawHref.trim();
            href = href.replaceFirst("^/(vi|en)/", "/");
            href = href.replaceFirst("^/(?!business-sector/).*", "/business-sector/" + slug);
            if (!href.startsWith("/business-sector/")) {
                href = "/business-sector/" + slug;
            }
            return href;
        }
        return "/business-sector/" + slug;
    }
}
