package com.greenlife.repository;

import com.greenlife.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String>, JpaSpecificationExecutor<User> {

    Optional<User> findByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findByEmailWithRoles(String email);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.isActive = true")
    List<User> findAllActive();

    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.userRoles ur LEFT JOIN FETCH ur.role r LEFT JOIN FETCH r.rolePermissions rp WHERE u.id = :id")
    Optional<User> findByIdWithRoles(String id);
    
    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.userRoles ur LEFT JOIN FETCH ur.role r LEFT JOIN FETCH r.rolePermissions rp")
    List<User> findAllWithRoles();
}
