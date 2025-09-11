package com.hexaware.AssetManagement.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hexaware.AssetManagement.dto.AuthRequest;
import com.hexaware.AssetManagement.dto.AuthResponse;
import com.hexaware.AssetManagement.dto.RegisterRequest;
import com.hexaware.AssetManagement.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UserController {

	private static final Logger logger = LoggerFactory.getLogger(UserController.class);

	@Autowired
	private UserService userService;

	@PostMapping("/register")
	public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
		logger.info("Registration request received for user: {}", registerRequest.getUsername());
		AuthResponse response = userService.registerUser(registerRequest);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/auth/login")
	public ResponseEntity<AuthResponse> authenticateAndGetToken(@Valid @RequestBody AuthRequest authRequest) {
		logger.info("Login request received for user: {}", authRequest.getUsername());
		AuthResponse response = userService.authenticateAndGetToken(authRequest);
		return ResponseEntity.ok(response);
	}
}