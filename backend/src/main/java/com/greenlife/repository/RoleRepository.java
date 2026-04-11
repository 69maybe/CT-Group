package com.greenlife.repository;

import com.greenlife.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {

    Optional<Role> findByName(String name);

    boolean existsByName(String name);

    List<Role> findByIsDefaultTrue();

    @Query("SELECT r FROM Role r LEFT JOIN FETCH r.rolePermissions rp LEFT JOIN FETCH rp.permission WHERE r.id = :id")
    Optional<Role> findByIdWithPermissions(String id);

    @Query("SELECT DISTINCT r FROM Role r LEFT JOIN FETCH r.rolePermissions rp LEFT JOIN FETCH rp.permission LEFT JOIN FETCH r.userRoles")
    List<Role> findAllWithDetails();
}
