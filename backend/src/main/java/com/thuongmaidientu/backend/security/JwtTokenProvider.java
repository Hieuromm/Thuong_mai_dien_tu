package com.thuongmaidientu.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    // Khóa bí mật để mã hóa Token (Không được lộ ra ngoài)
    // Trong thực tế nên để trong file application.properties
    private final String JWT_SECRET = "KhoaBiMatNayCanPhaiDaiHon32KyTuDeDamBaoAnToanNhe123456789";

    // Thời gian hết hạn của Token (1 ngày = 86400000 ms)
    private final long JWT_EXPIRATION = 86400000L;

    // Lấy key ký tên
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(JWT_SECRET.getBytes());
    }

    /**
     * 1. Tạo Token từ thông tin Username
     */
    public String generateToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * 2. Lấy Username từ Token (Giải mã)
     */
    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    /**
     * 3. Kiểm tra Token có hợp lệ không
     */
    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(authToken);
            return true;
        } catch (MalformedJwtException ex) {
            System.err.println("Token không hợp lệ");
        } catch (ExpiredJwtException ex) {
            System.err.println("Token đã hết hạn");
        } catch (UnsupportedJwtException ex) {
            System.err.println("Token không được hỗ trợ");
        } catch (IllegalArgumentException ex) {
            System.err.println("Chuỗi claims rỗng");
        }
        return false;
    }
}