package com.ctgroup.repository;

import com.ctgroup.entity.RolePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, String> {

    List<RolePermission> findByRoleId(String roleId);

    void deleteByRoleId(String roleId);

    boolean existsByRoleIdAndPermissionId(String roleId, String permissionId);
}
