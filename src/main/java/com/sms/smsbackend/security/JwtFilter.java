package com.sms.smsbackend.security;

import com.sms.smsbackend.model.User;
import com.sms.smsbackend.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public JwtFilter(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();
        System.out.println("🔍 Request path: " + path);

        // ⏭ Allow unauthenticated access to /api/auth/**
        if (path.startsWith("/api/auth")) {
            System.out.println("⏭ Skipping filter for auth");
            filterChain.doFilter(request, response);
            return;
        }

        // 🔐 Check for token
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("⚠️ No Bearer token found");
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        try {
            String email = jwtUtil.extractUsername(token);
            System.out.println("📧 Extracted email from token: " + email);

            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                System.out.println("❌ User not found");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("❌ User not found");
                return;
            }

            if (!user.isActive()) {
                System.out.println("🚫 User is deactivated");
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write("🚫 Account is deactivated");
                return;
            }

            System.out.println("👤 Role: " + user.getRole());

            // 🛡️ Allow only admins to access /api/admin/**
            if (path.startsWith("/api/admin") && !user.isAdmin()) {
                System.out.println("❌ Admin access required");
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write("❌ Admin access required");
                return;
            }

            // ✅ Set authenticated user
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email, null, Collections.emptyList());
            SecurityContextHolder.getContext().setAuthentication(authentication);
            System.out.println("✅ Authenticated: " + email);

        } catch (Exception e) {
            System.out.println("❌ Token error: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("❌ Invalid or expired token");
            return;
        }

        // 🔁 Continue to next filter
        filterChain.doFilter(request, response);
    }
}
