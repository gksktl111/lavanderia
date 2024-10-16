package com.kyungmin.lavanderia.global.config;

import com.kyungmin.lavanderia.global.auth.jwt.data.repository.RefreshRepository;
import com.kyungmin.lavanderia.global.auth.jwt.filter.CustomLogoutFilter;
import com.kyungmin.lavanderia.global.auth.jwt.filter.JWTFilter;
import com.kyungmin.lavanderia.global.auth.jwt.filter.LoginFilter;
import com.kyungmin.lavanderia.global.auth.oauth2.handler.CustomSuccessHandler;
import com.kyungmin.lavanderia.global.auth.oauth2.service.CustomOAuth2UserService;
import com.kyungmin.lavanderia.global.auth.util.JWTUtil;
import com.kyungmin.lavanderia.global.auth.util.MakeCookie;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.Collections;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity // Spring Security를 위한 설정 클래스임을 선언
@ComponentScan(basePackages = {"com.kyungmin.lavanderia.global.auth.jwt.data.*","com.kyungmin.lavanderia.*"})
public class SecurityConfig {

    private final AuthenticationConfiguration authenticationConfiguration;
    private final JWTUtil jwtUtil;
    private final RefreshRepository refreshRepository;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomSuccessHandler customSuccessHandler;
    private final MakeCookie makeCookie;

    //AuthenticationManager Bean 등록
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{

        // 로그인 필터 추가
        LoginFilter loginFilter = new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil, makeCookie);
        loginFilter.setFilterProcessesUrl("/signin"); // 실제 로그인을 처리할 URL을 입력

        http.cors((cors) -> cors
                .configurationSource(request -> {

                    CorsConfiguration configuration = new CorsConfiguration();

                    configuration.setAllowedOrigins(Collections.singletonList("http://localhost:3000")); // 허용할 포트
                    configuration.setAllowedMethods(Collections.singletonList("*")); // 모든 메소드 허용
                    configuration.setAllowCredentials(true);
                    configuration.setAllowedHeaders(Collections.singletonList("*")); // 헤더 허용
                    configuration.setMaxAge(3600L);

                    configuration.setExposedHeaders(Collections.singletonList("Set-Cookie"));
                    configuration.setExposedHeaders(Collections.singletonList("access")); // 헤더 허용

                    return configuration;
                }));

        // CSRF(Cross-Site Request Forgery) 보호를 비활성화
        http.csrf((auth) -> auth.disable());

        // 기본 로그인 폼 기반의 인증을 비활성화
        http.formLogin((auth) -> auth.disable());

        // HTTP Basic 인증을 비활성화 -> 보완성이 낮아서 비활성
        http.httpBasic((auth) -> auth.disable());

        // oauth2
        http.oauth2Login((oauth2) -> oauth2
                .userInfoEndpoint((userInfoEndpointConfig) -> userInfoEndpointConfig
                        .userService(customOAuth2UserService))
                .successHandler(customSuccessHandler));

        // 경로별 인가 작업
        http.authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/signin", "/signup", "/check-phone-number", "/send-code", "/check-code").permitAll() // /login, /, /join 경로는 모든 사용자가 접근할 수 있도록 허용
                        .requestMatchers("reissue").permitAll() // refresh token 재발급 모든 사용자 접근 허용
                        .requestMatchers("/admin").hasRole("ADMIN") // /admin 경로는 "ADMIN" 역할을 가진 사용자만 접근할 수 있도록 설정
                        .requestMatchers("/").authenticated() // 인증된 유저만 접근 가능
                        .anyRequest().permitAll()); // 나머지 요청은 모두 접근 가능

        http.addFilterBefore(new JWTFilter(jwtUtil), LoginFilter.class);

        http.addFilterBefore(new CustomLogoutFilter(jwtUtil, refreshRepository), LogoutFilter.class);

        http.addFilterAt(loginFilter, UsernamePasswordAuthenticationFilter.class);

        //세션 설정
        http.sessionManagement((session) -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
}