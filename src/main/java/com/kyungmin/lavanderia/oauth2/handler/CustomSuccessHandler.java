package com.kyungmin.lavanderia.oauth2.handler;

import com.kyungmin.lavanderia.jwt.data.entity.RefreshEntity;
import com.kyungmin.lavanderia.jwt.data.repository.RefreshRepository;
import com.kyungmin.lavanderia.jwt.util.JWTUtil;
import com.kyungmin.lavanderia.jwt.util.TokenExpirationTime;
import com.kyungmin.lavanderia.oauth2.data.dto.CustomOAuth2User;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;

@Component
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private Long accessExpiredMs = TokenExpirationTime.ACCESS_TIME;
    private Long refreshExpiredMs = TokenExpirationTime.REFRESH_TIME;

    private final JWTUtil jwtUtil;
    private final RefreshRepository refreshRepository;
    public CustomSuccessHandler(JWTUtil jwtUtil,RefreshRepository refreshRepository) {
        this.jwtUtil = jwtUtil;
        this.refreshRepository = refreshRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        //OAuth2User
        CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();

        String memberId = customUserDetails.getUsername();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        String access = jwtUtil.createJwt("access", memberId, role, accessExpiredMs);
        String refresh = jwtUtil.createJwt("refresh", memberId, role, refreshExpiredMs);


        // Refresh 토큰 저장
        addRefreshEntity(memberId,refresh,  refreshExpiredMs);

        //응답 설정
        response.setHeader("access", access);
        response.addCookie(createCookie("refresh", refresh));
        response.sendRedirect("http://localhost:3000/");

    }

    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(60*60*60);
        //cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setHttpOnly(true);

        return cookie;
    }

    private void addRefreshEntity(String memberId, String refresh, Long expiredMs) {

        RefreshEntity refreshEntity = RefreshEntity.builder()
                .memberId(memberId)
                .refresh(refresh)
                .expiration(expiredMs)
                .build();

        refreshRepository.save(refreshEntity);
    }
}