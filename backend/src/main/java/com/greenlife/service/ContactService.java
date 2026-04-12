package com.greenlife.service;

import com.greenlife.dto.request.ContactRequest;
import com.greenlife.dto.response.ContactSubmissionResponse;
import com.greenlife.entity.Contact;
import com.greenlife.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;

    @Transactional
    public ContactSubmissionResponse submit(ContactRequest request) {
        Contact contact = Contact.builder()
                .name(request.getName().trim())
                .email(request.getEmail().trim())
                .phone(request.getPhone() != null ? request.getPhone().trim() : null)
                .subject(request.getSubject() != null ? request.getSubject().trim() : null)
                .message(request.getMessage().trim())
                .status("new")
                .build();
        contact = contactRepository.save(contact);
        return ContactSubmissionResponse.builder()
                .id(contact.getId())
                .build();
    }
}
