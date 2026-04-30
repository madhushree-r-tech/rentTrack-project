package com.kushipg6.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints - no token needed
                .requestMatchers("/api/auth/**").permitAll()
                // Owner only endpoints
                .requestMatchers("/api/owner/**").hasAuthority("ROLE_OWNER")
                // Warden only endpoints
                .requestMatchers("/api/rooms/**").hasAuthority("ROLE_WARDEN")
                .requestMatchers("/api/tenants/**").hasAuthority("ROLE_WARDEN")
                .requestMatchers("/api/payments/**").hasAuthority("ROLE_WARDEN")
                .requestMatchers("/api/branches/**").hasAuthority("ROLE_WARDEN")
                // Everything else needs authentication
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}