package com.firmatrack.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. On cherche l'en-tête "Authorization" dans la requête
        String authHeader = request.getHeader("Authorization");

        // 2. On vérifie s'il contient un Token valide (qui commence par "Bearer ")
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // On enlève le mot "Bearer "

            // 3. On demande à JwtUtil si le token est vrai et non expiré
            if (jwtUtil.isTokenValid(token)) {
                String email = jwtUtil.extractUsername(token);
                
                // 4. On donne le feu vert à Spring Security !
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(email, null, Collections.emptyList());

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        // 5. On laisse passer la requête vers le Controller des filles
        filterChain.doFilter(request, response);
    }
}