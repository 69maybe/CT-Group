package com.ctgroup.service;

import com.ctgroup.entity.Setting;
import com.ctgroup.repository.SettingRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SettingService {
    private final SettingRepository settingRepository;
    private final ObjectMapper objectMapper;

    public Map<String, Setting> byKeyForGroup(String groupName) {
        List<Setting> list = settingRepository.findByGroupName(groupName);
        Map<String, Setting> map = new HashMap<>();
        for (Setting s : list) {
            map.put(s.getKey(), s);
        }
        return map;
    }

    public Optional<String> getString(String group, String key) {
        return settingRepository.findByKey(key)
                .filter(s -> group.equals(s.getGroupName()))
                .map(Setting::getValue);
    }

    public <T> Optional<T> getJson(String group, String key, TypeReference<T> ref) {
        return getString(group, key).map(v -> {
            try {
                return objectMapper.readValue(v, ref);
            } catch (Exception e) {
                return null;
            }
        });
    }

    @Transactional
    public void upsert(String group, String key, String type, String value) {
        Setting s = settingRepository.findByKey(key)
                .filter(x -> group.equals(x.getGroupName()))
                .orElseGet(() -> Setting.builder().groupName(group).key(key).build());
        s.setType(type);
        s.setValue(value == null ? "" : value);
        settingRepository.save(s);
    }
}

