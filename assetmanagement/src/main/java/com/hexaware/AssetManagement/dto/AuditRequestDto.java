package com.hexaware.AssetManagement.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuditRequestDto {
	private Long auditId;

	@NotNull(message = "Employee ID is required")
	@Positive(message = "Employee ID must be positive")
	private Long employeeId;

	private String employeeName;
	private String employeeEmail;

	@NotNull(message = "Asset ID is required")
	@Positive(message = "Asset ID must be positive")
	private Long assetId;

	private String assetNo;
	private String assetName;
	private LocalDateTime auditDate;

	@Pattern(regexp = "^(PENDING|VERIFIED|REJECTED)$", message = "Status must be PENDING, VERIFIED, or REJECTED")
	private String status;

	@Size(max = 500, message = "Employee comments must not exceed 500 characters")
	private String employeeComments;

	@Size(max = 500, message = "Admin comments must not exceed 500 characters")
	private String adminComments;

	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}