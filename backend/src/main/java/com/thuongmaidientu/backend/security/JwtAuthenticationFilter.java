package com.thuongmaidientu.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("--------------------------------------------------");
        System.out.println(">>> BẮT ĐẦU FILTER CHO: " + request.getRequestURI());

        String jwt = getJwtFromRequest(request);

        // KIỂM TRA 1: Token có lấy được từ Header không?
        if (jwt == null) {
            System.out.println(">>> KẾT QUẢ: Không tìm thấy Token trong Header Authorization!");
        } else {
            System.out.println(">>> KẾT QUẢ: Đã lấy được Token: " + jwt.substring(0, Math.min(jwt.length(), 10)) + "...");

            // KIỂM TRA 2: Token có vượt qua được bước kiểm tra chữ ký/hết hạn không?
            if (tokenProvider.validateToken(jwt)) {
                System.out.println(">>> KẾT QUẢ: Token HỢP LỆ.");

                String username = tokenProvider.getUsernameFromToken(jwt);
                System.out.println(">>> KẾT QUẢ: Username từ Token là: " + username);

                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                if (userDetails != null) {
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println(">>> KẾT QUẢ: Đã nạp quyền [" + userDetails.getAuthorities() + "] vào SecurityContext.");
                }
            } else {
                System.out.println(">>> KẾT QUẢ: Token KHÔNG hợp lệ (Sai chữ ký hoặc hết hạn).");
            }
        }

        System.out.println(">>> KẾT THÚC FILTER, ĐI TIẾP VÀO CHUỖI BẢO MẬT...");
        System.out.println("--------------------------------------------------");
        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
        return path.startsWith("/api/ai/") || path.startsWith("/uploads/");
    }
}