package com.hexaware.assetManagement.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import com.hexaware.assetManagement.filter.JwtAuthFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
	
	@Autowired
	JwtAuthFilter jwtAuthFilter;
	
    @Bean
    //authentication
    public UserDetailsService userDetailsService() {
    	
			UserDetails   user1 = User.withUsername("Niki")
				.password("nickie123")
				.roles("admin")
				.build();
	
			UserDetails   user2 = User.withUsername("Simba")
			.password("simba123")
			.roles("user","hr")
			.build();

return new  InMemoryUserDetailsManager(user1,user2);
    }
    
    @Bean
    public SecurityFilterChain   securityFilterChain(HttpSecurity http) throws Exception {
		
		
		return http.authorizeHttpRequests(auth->{
			
			auth.requestMatchers("/").permitAll();
			auth.anyRequest().authenticated();
			})
		    .oauth2Login(Customizer.withDefaults())
			.formLogin(Customizer.withDefaults())
			.build();
		
	}
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService());
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

}
