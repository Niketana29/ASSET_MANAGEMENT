package com.hexaware.AssetManagement.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import com.hexaware.AssetManagement.filter.JwtAuthFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

	@Autowired
	private JwtAuthFilter jwtAuthFilter;

	@Autowired
	private CorsConfigurationSource corsConfigurationSource;

	@Bean
	public UserDetailsService userDetailsService() {
		return new UserInfoUserDetailsService();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		return http
				// Disable CSRF for REST API
				.csrf(AbstractHttpConfigurer::disable)

				// Configure CORS
				.cors(cors -> cors.configurationSource(corsConfigurationSource))

				// Configure authorization rules
				.authorizeHttpRequests(auth -> auth
						// Public endpoints
						.requestMatchers("/api/auth/**", "/api/register").permitAll()
						.requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
						.requestMatchers("/actuator/**").permitAll()

						// Admin endpoints
						.requestMatchers("/api/admin/**").hasRole("ADMIN")
						.requestMatchers("/api/assets/add", "/api/assets/update/**", "/api/assets/delete/**")
						.hasRole("ADMIN")
						.requestMatchers("/api/categories/add", "/api/categories/update/**",
								"/api/categories/delete/**")
						.hasRole("ADMIN").requestMatchers("/api/employees/delete/**").hasRole("ADMIN")
						.requestMatchers("/api/allocations/admin/**").hasRole("ADMIN")
						.requestMatchers("/api/service-requests/admin/**").hasRole("ADMIN")
						.requestMatchers("/api/audit-requests/admin/**").hasRole("ADMIN")

						// Employee/User endpoints
						.requestMatchers("/api/assets/browse", "/api/assets/{id}").hasAnyRole("USER", "ADMIN")
						.requestMatchers("/api/allocations/my/**", "/api/allocations/request").hasRole("USER")
						.requestMatchers("/api/service-requests/my/**", "/api/service-requests/create").hasRole("USER")
						.requestMatchers("/api/audit-requests/my/**", "/api/audit-requests/verify/**").hasRole("USER")

						// All other requests need authentication
						.anyRequest().authenticated())

				// Configure session management as stateless
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

				// Set authentication provider
				.authenticationProvider(authenticationProvider())

				// Add JWT filter before UsernamePasswordAuthenticationFilter
				.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

				.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
		authenticationProvider.setUserDetailsService(userDetailsService());
		authenticationProvider.setPasswordEncoder(passwordEncoder());
		return authenticationProvider;
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}
}