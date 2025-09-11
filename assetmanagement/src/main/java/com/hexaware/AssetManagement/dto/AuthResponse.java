package com.hexaware.AssetManagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
	private String token;
	private String username;
	private String role;
	private Long employeeId;
	private String message;

	public AuthResponse(String token, String username, String role, Long employeeId) {
		this.token = token;
		this.username = username;
		this.role = role;
		this.employeeId = employeeId;
	}
}