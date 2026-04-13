package com.ctgroup.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/** Seed admin; override via app.seed or ADMIN_EMAIL / ADMIN_PASSWORD (profile dev). */
@Data
@Component
@ConfigurationProperties(prefix = "app.seed")
public class AppSeedProperties {

    private String adminEmail = "admin@ctgroup.vn";
    private String adminPassword = "Admin@123";
}
