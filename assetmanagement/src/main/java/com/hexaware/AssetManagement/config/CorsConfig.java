package com.hexaware.AssetManagement.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();

		// Allow specific origins - update with your frontend URL
		configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));

		// Allow specific HTTP methods
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

		// Allow specific headers
		configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept",
				"Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"));

		// Expose headers to the client
		configuration.setExposedHeaders(
				Arrays.asList("Access-Control-Allow-Origin", "Access-Control-Allow-Credentials", "Authorization"));

		// Allow credentials
		configuration.setAllowCredentials(true);

		// Set max age for preflight requests (in seconds)
		configuration.setMaxAge(3600L);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);

		return source;
	}
}