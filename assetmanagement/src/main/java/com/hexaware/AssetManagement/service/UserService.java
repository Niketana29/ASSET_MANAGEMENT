package com.hexaware.AssetManagement.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hexaware.AssetManagement.dto.AuthRequest;
import com.hexaware.AssetManagement.dto.AuthResponse;
import com.hexaware.AssetManagement.dto.RegisterRequest;
import com.hexaware.AssetManagement.entities.Employee;
import com.hexaware.AssetManagement.entities.UserInfo;
import com.hexaware.AssetManagement.exception.BusinessException;
import com.hexaware.AssetManagement.repository.EmployeeRepository;
import com.hexaware.AssetManagement.repository.UserInfoRepository;

@Service
@Transactional
public class UserService {

	private static final Logger logger = LoggerFactory.getLogger(UserService.class);

	@Autowired
	private UserInfoRepository userInfoRepository;

	@Autowired
	private EmployeeRepository employeeRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JwtService jwtService;

	@Autowired
	private AuthenticationManager authenticationManager;

	public AuthResponse registerUser(RegisterRequest registerRequest) {
		logger.info("Registering new user: {}", registerRequest.getUsername());

		// Check if username already exists
		if (userInfoRepository.existsByUsername(registerRequest.getUsername())) {
			throw new BusinessException("Username already exists: " + registerRequest.getUsername());
		}

		// Check if email already exists
		if (employeeRepository.existsByEmail(registerRequest.getEmail())) {
			throw new BusinessException("Email already exists: " + registerRequest.getEmail());
		}

		try {
			// Create employee record
			Employee employee = new Employee();
			employee.setEmployeeName(registerRequest.getEmployeeName());
			employee.setEmail(registerRequest.getEmail());
			employee.setContactNumber(registerRequest.getContactNumber());
			employee.setGender(registerRequest.getGender());
			employee.setAddress(registerRequest.getAddress());
			Employee savedEmployee = employeeRepository.save(employee);

			// Create user info record
			UserInfo userInfo = new UserInfo();
			userInfo.setUsername(registerRequest.getUsername());
			userInfo.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
			userInfo.setRoles("ROLE_USER"); // Default role for new users
			userInfoRepository.save(userInfo);

			logger.info("User registered successfully: {}", registerRequest.getUsername());

			// Generate JWT token
			String token = jwtService.generateToken(registerRequest.getUsername());

			return new AuthResponse(token, registerRequest.getUsername(), "ROLE_USER", savedEmployee.getEmployeeId());

		} catch (Exception e) {
			logger.error("Error registering user: {}", e.getMessage());
			throw new BusinessException("Failed to register user: " + e.getMessage());
		}
	}

	public AuthResponse authenticateAndGetToken(AuthRequest authRequest) {
		logger.info("Authenticating user: {}", authRequest.getUsername());

		try {
			// Authenticate user
			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));

			if (authentication.isAuthenticated()) {
				// Get user info
				UserInfo userInfo = userInfoRepository.findByUsername(authRequest.getUsername())
						.orElseThrow(() -> new BusinessException("User not found"));

				// Get employee info for users (not for admins)
				Long employeeId = null;
				if ("ROLE_USER".equals(userInfo.getRoles())) {
					Employee employee = employeeRepository.findByEmail(authRequest.getUsername()).orElse(null);
					if (employee != null) {
						employeeId = employee.getEmployeeId();
					}
				}

				// Generate token
				String token = jwtService.generateToken(authRequest.getUsername());

				logger.info("User authenticated successfully: {}", authRequest.getUsername());

				return new AuthResponse(token, authRequest.getUsername(), userInfo.getRoles(), employeeId);

			} else {
				throw new BusinessException("Invalid credentials");
			}

		} catch (Exception e) {
			logger.error("Authentication failed for user {}: {}", authRequest.getUsername(), e.getMessage());
			throw new BusinessException("Authentication failed: " + e.getMessage());
		}
	}
}