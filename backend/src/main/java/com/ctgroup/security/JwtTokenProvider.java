package com.ctgroup.security;

import com.ctgroup.config.AppConfig;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final AppConfig appConfig;
    private SecretKey key;

    public JwtTokenProvider(AppConfig appConfig) {
        this.appConfig = appConfig;
    }

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(appConfig.getJwtSecret().getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(String userId, String email, java.util.List<String> roles, java.util.List<String> permissions) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + appConfig.getAccessTokenExpiration());

        return Jwts.builder()
                .subject(userId)
                .claim("email", email)
                .claim("roles", roles)
                .claim("permissions", permissions)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public String generateRefreshToken(String userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + appConfig.getRefreshTokenExpiration());

        return Jwts.builder()
                .subject(userId)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public String getUserIdFromToken(String token) {
        Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
