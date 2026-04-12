package com.greenlife.controller;

import com.greenlife.dto.request.ContactRequest;
import com.greenlife.dto.response.ApiResponse;
import com.greenlife.dto.response.ContactSubmissionResponse;
import com.greenlife.service.ContactService;
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
