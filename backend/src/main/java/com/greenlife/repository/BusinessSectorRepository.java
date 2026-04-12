package com.greenlife.repository;

import com.greenlife.entity.BusinessSector;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BusinessSectorRepository extends JpaRepository<BusinessSector, String> {

    List<BusinessSector> findByActiveTrueOrderBySortOrderAsc();

    Optional<BusinessSector> findBySlugAndActiveTrue(String slug);

    Optional<BusinessSector> findBySlug(String slug);
}
