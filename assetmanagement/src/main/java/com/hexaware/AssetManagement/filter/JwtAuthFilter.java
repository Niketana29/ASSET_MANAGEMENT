package com.hexaware.AssetManagement.filter;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.hexaware.AssetManagement.config.UserInfoUserDetailsService;
import com.hexaware.AssetManagement.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

	private static final Logger logger = LoggerFactory.getLogger(JwtAuthFilter.class);

	@Autowired
	private JwtService jwtService;

	@Autowired
	private UserInfoUserDetailsService userDetailsService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String authHeader = request.getHeader("Authorization");
		String token = null;
		String username = null;

		try {
			// Check if Authorization header exists and starts with "Bearer "
			if (authHeader != null && authHeader.startsWith("Bearer ")) {
				token = authHeader.substring(7); // Remove "Bearer " prefix
				username = jwtService.extractUsername(token);
				logger.debug("JWT token found for user: {}", username);
			}

			// If username is extracted and no authentication exists in security context
			if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
				UserDetails userDetails = userDetailsService.loadUserByUsername(username);

				// Validate token
				if (jwtService.validateToken(token, userDetails)) {
					UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails,
							null, userDetails.getAuthorities());
					authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
					SecurityContextHolder.getContext().setAuthentication(authToken);

					logger.debug("Successfully authenticated user: {}", username);
				} else {
					logger.warn("Invalid JWT token for user: {}", username);
				}
			}
		} catch (Exception e) {
			logger.error("Cannot set user authentication: {}", e.getMessage());
			// Clear security context on error
			SecurityContextHolder.clearContext();
		}

		// Continue with the filter chain
		filterChain.doFilter(request, response);
	}

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
		String path = request.getRequestURI();

		// Skip JWT filtering for public endpoints
		return path.startsWith("/api/auth/") || path.equals("/api/register") || path.startsWith("/swagger-ui/")
				|| path.startsWith("/v3/api-docs") || path.equals("/swagger-ui.html") || path.startsWith("/actuator/")
				|| path.equals("/favicon.ico");
	}
}