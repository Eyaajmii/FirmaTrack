package com.firmatrack.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; // <--- L'IMPORT QUI MANQUAIT

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) 
            .cors(cors -> cors.configure(http)) 
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Bonne pratique pour JWT
            .authorizeHttpRequests(auth -> auth
            	    .requestMatchers("/api/auth/**").permitAll() 
            	    .requestMatchers("/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
            	    .requestMatchers("/uploads/**").permitAll() 
            	    
            	    .requestMatchers("/api/finance/**").hasAnyRole("FERMIER", "ADMIN")
                    .requestMatchers("/api/users/**", "/api/fermier/**", "/api/veterinaires/**").permitAll() 
                    .requestMatchers("/api/cheptel/**").hasAnyRole("ADMIN", "FERMIER")
                    .requestMatchers("/api/lots/**").hasAnyRole("ADMIN", "FERMIER")
                    .requestMatchers("/api/carnetsante/**").hasAnyRole("ADMIN", "FERMIER", "VETERINAIRE")
                    .requestMatchers("/api/rendezvous/**").hasAnyRole("ADMIN", "FERMIER", "VETERINAIRE")
                    .requestMatchers("/api/forum/**").hasAnyRole("FERMIER", "ADMIN", "VETERINAIRE")
                    .requestMatchers("/api/stock/**").hasAnyRole("ADMIN", "FERMIER")
                    .requestMatchers("/api/production-lait/**").hasAnyRole("ADMIN", "FERMIER")
                    .requestMatchers("/api/production-oeufs/**").hasAnyRole("ADMIN", "FERMIER")
                    .requestMatchers("/api/epidemies/**").hasAnyRole("FERMIER","VETERINAIRE", "ADMIN")
                    .requestMatchers("/api/notifications/**").hasAnyRole("FERMIER", "ADMIN", "VETERINAIRE", "ELEVEUR")

            	    .anyRequest().authenticated()
            	)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class); 
        return http.build();
    }
}