package com.ctgroup.controller;

import com.ctgroup.dto.request.BusinessSectorRequest;
import com.ctgroup.dto.response.ApiResponse;
import com.ctgroup.dto.response.BusinessSectorAdminResponse;
import com.ctgroup.service.BusinessSectorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/business-sectors")
@RequiredArgsConstructor
public class AdminBusinessSectorController {

    private final BusinessSectorService businessSectorService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<BusinessSectorAdminResponse>>> listAll() {
        return ResponseEntity.ok(ApiResponse.success(businessSectorService.listAll()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<BusinessSectorAdminResponse>> create(@Valid @RequestBody BusinessSectorRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Business sector created successfully", businessSectorService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<BusinessSectorAdminResponse>> update(
            @PathVariable String id,
            @RequestBody BusinessSectorRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Business sector updated successfully", businessSectorService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        businessSectorService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Business sector deleted successfully", null));
    }
}
