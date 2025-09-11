package com.hexaware.AssetManagement.dto;

import jakarta.validation.constraints.NotBlank;
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
public class ServiceRequestDto {
	private Long requestId;

	@NotNull(message = "Employee ID is required")
	@Positive(message = "Employee ID must be positive")
	private Long employeeId;

	@NotNull(message = "Asset ID is required")
	@Positive(message = "Asset ID must be positive")
	private Long assetId;

	@NotBlank(message = "Asset number is required")
	@Size(min = 3, max = 50, message = "Asset number must be between 3 and 50 characters")
	private String assetNo;

	@NotBlank(message = "Description is required")
	@Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
	private String description;

	@NotBlank(message = "Issue type is required")
	@Pattern(regexp = "^(MALFUNCTION|REPAIR|MAINTENANCE|OTHER)$", message = "Issue type must be MALFUNCTION, REPAIR, MAINTENANCE, or OTHER")
	private String issueType;

	@Pattern(regexp = "^(PENDING|IN_PROGRESS|COMPLETED|REJECTED)$", message = "Status must be PENDING, IN_PROGRESS, COMPLETED, or REJECTED")
	private String status;

	@Size(max = 500, message = "Admin comments must not exceed 500 characters")
	private String adminComments;
}