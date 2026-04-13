package com.ctgroup.controller;

import com.ctgroup.dto.request.ContactRequest;
import com.ctgroup.dto.response.ApiResponse;
import com.ctgroup.dto.response.ContactSubmissionResponse;
import com.ctgroup.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/contacts")
@RequiredArgsConstructor
public class PublicContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<ApiResponse<ContactSubmissionResponse>> submit(@Valid @RequestBody ContactRequest request) {
        ContactSubmissionResponse saved = contactService.submit(request);
        return ResponseEntity.ok(ApiResponse.success("Contact message received", saved));
    }
}
