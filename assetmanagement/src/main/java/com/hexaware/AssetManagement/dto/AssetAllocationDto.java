package com.hexaware.AssetManagement.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssetAllocationDto {
	private Long allocationId;

	@NotNull(message = "Employee ID is required")
	private Long employeeId;

	@NotNull(message = "Asset ID is required")
	private Long assetId;

	private String requestReason;
	private String status;
	private String adminComments;
}