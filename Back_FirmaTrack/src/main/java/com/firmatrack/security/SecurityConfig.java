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

    // <--- LA DÉCLARATION DU FILTRE QUI MANQUAIT
    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;

    // 1. Déclaration du Hachage BCrypt
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 2. Configuration des portes ouvertes et fermées
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // On désactive ça pour les API REST
            .cors(cors -> cors.configure(http)) // Autorise React à parler au serveur
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Bonne pratique pour JWT
         // ... (garder le début du fichier identique)
            .authorizeHttpRequests(auth -> auth
            	    // 1. Routes ouvertes (Auth et Swagger)
            	    .requestMatchers("/api/auth/**").permitAll() 
            	    .requestMatchers("/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
            	    .requestMatchers("/uploads/**").permitAll() 
            	    
            	    // 2. Ton module Finance (ouvert pour l'instant pour les tests)
            	    .requestMatchers("/api/finance/**").hasAnyRole("FERMIER", "ADMIN")
            	    // 3. Leurs modules avec sécurité par Rôle (Code de Aya/Mariem)
                    .requestMatchers("/api/users/**", "/api/fermier/**", "/api/veterinaires/**").permitAll() 
                    .requestMatchers("/api/cheptel/**").hasAnyRole("ADMIN", "FERMIER")
                    .requestMatchers("/api/lots/**").hasAnyRole("ADMIN", "FERMIER")
                    .requestMatchers("/api/carnetsante/**").hasAnyRole("ADMIN", "FERMIER", "VETERINAIRE")
                    .requestMatchers("/api/rendezvous/**").hasAnyRole("ADMIN", "FERMIER", "VETERINAIRE")
                    .requestMatchers("/api/forum/**").hasAnyRole("FERMIER", "ADMIN", "VETERINAIRE")
                    .requestMatchers("/api/stock/**").hasAnyRole("ADMIN", "FERMIER")
                    .requestMatchers("/api/production-lait/**").hasAnyRole("ADMIN", "FERMIER")
                    .requestMatchers("/api/production-oeufs/**").hasAnyRole("ADMIN", "FERMIER")

            	    // 4. Protection globale
            	    .anyRequest().authenticated()
            	)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class); 
        return http.build();
    }
}