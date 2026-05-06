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
            .authorizeHttpRequests(auth -> auth
            	    // 1. Tes routes Auth sont ouvertes
            	    .requestMatchers("/api/auth/**").permitAll() 
            	    
            	    // 2. On laisse ouvert Swagger pour les filles ! (TRÈS IMPORTANT)
            	    .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
            	    
            	    // 3. On laisse ouvert les API des filles PROVISOIREMENT le temps du développement
            	    .requestMatchers("/api/users/**", "/api/fermier/**", "/api/veterinaires/**").permitAll() 
            	    
            	    // --- AJOUTE CETTE LIGNE ICI POUR TON MODULE ---
            	    .requestMatchers("/api/finance/**").permitAll() 
            	    // ----------------------------------------------
            	    
            	    
            	    // 4. Seul le reste (ce qui n'est pas listé au-dessus) sera bloqué
            	    .anyRequest().permitAll()
            	)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
 
        return http.build();
    }
}