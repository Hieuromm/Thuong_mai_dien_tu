package com.thuongmaidientu.backend.config;

import com.thuongmaidientu.backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // 👈 QUAN TRỌNG: Đừng quên import dòng này
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Tắt CSRF (Bắt buộc với API RESTful để gọi được POST/PUT/DELETE)
                .csrf(AbstractHttpConfigurer::disable)
                // 2. Kích hoạt cấu hình CORS từ Bean bên dưới
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 3. Phân quyền truy cập (Authorize)
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // --- API CÔNG KHAI (Không cần Token) ---
                        .requestMatchers(
                                "/api/auth/**",       // Login, Register
                                "/api/ai/**",
                                "/api/public/**",     // Xem sản phẩm, search
                                "/api/reviews/**",// Xem ảnh upload,
                                "/ws/**",
                                "/uploads/**",
                                "/images/**"

                        ).permitAll()
                        .requestMatchers("/images/**").permitAll()
                        .requestMatchers("/api/address/**").authenticated()
                        .requestMatchers("/api/user/addresses/**").hasAnyRole("USER", "SELLER")
                        .requestMatchers("/api/user/**").hasAnyRole("USER", "SELLER")
                        .requestMatchers("/api/products/**", "/api/categories/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/reviews/**").permitAll()
                        .requestMatchers("/api/public/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers("/api/search/**").permitAll()

                        // --- API CẦN ĐĂNG NHẬP (User/Seller) ---
                        .requestMatchers(
                                "/api/cart/**",       // Giỏ hàng
                                "/api/orders/**",     // Đặt hàng, Hủy, Trả hàng
                                "/api/seller/**",     // Quản lý Shop
                                "/api/user/**"  ,   // Profile
                                "/api/reviews/create",
                                "/api/reviews/reply"
                        ).authenticated()

                        .requestMatchers("/api/seller/**").hasAuthority("SELLER")
                        .requestMatchers("/api/admin/stats/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/users/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )

                // 4. Quản lý Session: Stateless (Vì dùng JWT, không lưu session server)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 5. Cấu hình xác thực
                .authenticationProvider(authenticationProvider())

                // 6. Thêm Filter JWT trước Filter mặc định
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // --- CẤU HÌNH CORS CHUẨN (Khắc phục lỗi 403 & 500) ---
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173"
        ));

        // Cho phép các method
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // Cho phép các Header
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept"));

        // Cho phép gửi Credential (Cookie/Token) -> Bắt buộc phải setAllowedOrigins cụ thể
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // --- CÁC BEAN HỖ TRỢ ---

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        // Spring sẽ không chạy bất kỳ Filter nào cho đường dẫn này, giúp tải ảnh cực nhanh và không bị 403
        return (web) -> web.ignoring().requestMatchers(
                "/api/ai/**",
                "/uploads/**",
                "/uploads/products/**",
                "/images/**",
                "/static/**",
                "/favicon.ico"
        );
    }
}