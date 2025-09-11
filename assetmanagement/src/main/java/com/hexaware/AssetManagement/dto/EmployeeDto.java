package com.hexaware.AssetManagement.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeDto {
	private Long employeeId;

	@NotBlank(message = "Employee name is required")
	@Size(min = 2, max = 100, message = "Employee name must be between 2 and 100 characters")
	@Pattern(regexp = "^[a-zA-Z\\s.'-]+$", message = "Employee name can only contain letters, spaces, dots, apostrophes, and hyphens")
	private String employeeName;

	@Email(message = "Email should be valid")
	@NotBlank(message = "Email is required")
	@Size(max = 100, message = "Email must not exceed 100 characters")
	private String email;

	@Pattern(regexp = "^[+]?[0-9\\s()-]{10,15}$", message = "Contact number should be valid (10-15 digits)")
	private String contactNumber;

	@NotBlank(message = "Gender is required")
	@Pattern(regexp = "^(Male|Female|Other)$", message = "Gender must be Male, Female, or Other")
	private String gender;

	@Size(max = 500, message = "Address must not exceed 500 characters")
	private String address;

	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}