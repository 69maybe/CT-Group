package com.greenlife.repository;

import com.greenlife.entity.Contact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, String> {

    Page<Contact> findByStatus(String status, Pageable pageable);

    List<Contact> findByStatusOrderByCreatedAtDesc(String status);
}
