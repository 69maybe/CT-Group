package com.ctgroup.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

/**
 * Dev profile: DataSource from {@code ctgroup.dev.*} (default host port 5433 in compose) so
 * {@code spring.datasource.*} / {@code SPRING_DATASOURCE_*} on Windows do not hijack the pool.
 */
@Configuration
@Profile("dev")
public class DevDataSourceConfiguration {

    @Value("${ctgroup.dev.jdbc-url:jdbc:postgresql://127.0.0.1:5433/ctgroup?sslmode=disable}")
    private String jdbcUrl;

    @Value("${ctgroup.dev.username:postgres}")
    private String username;

    @Value("${ctgroup.dev.password:postgres}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(username);
        config.setPassword(password);
        config.setDriverClassName("org.postgresql.Driver");
        config.setConnectionTimeout(30_000);
        config.setMaxLifetime(1_800_000);
        config.setMinimumIdle(2);
        return new HikariDataSource(config);
    }
}
