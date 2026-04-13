package com.ctgroup.repository;

import com.ctgroup.entity.Setting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SettingRepository extends JpaRepository<Setting, String> {

    Optional<Setting> findByKey(String key);

    boolean existsByKey(String key);

    List<Setting> findByGroupName(String groupName);
}
