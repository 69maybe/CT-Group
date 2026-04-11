package com.greenlife.repository;

import com.greenlife.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {

    Optional<Category> findBySlug(String slug);

    boolean existsBySlug(String slug);

    List<Category> findByParentIsNullAndIsActiveTrueOrderBySortOrderAsc();

    List<Category> findByParentIdOrderBySortOrderAsc(String parentId);

    @Query("SELECT c FROM Category c WHERE c.isActive = true ORDER BY c.sortOrder ASC")
    List<Category> findAllActive();
}
