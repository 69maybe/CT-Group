package com.ctgroup.repository;

import com.ctgroup.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, String> {

    List<UserRole> findByUserId(String userId);

    List<UserRole> findByRoleId(String roleId);

    void deleteByUserId(String userId);

    boolean existsByUserIdAndRoleId(String userId, String roleId);
}
