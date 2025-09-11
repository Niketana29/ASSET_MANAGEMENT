package com.hexaware.AssetManagement.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssetAllocationResponseDto {
	private Long allocationId;
	private Long employeeId;
	private String employeeName;
	private String employeeEmail;
	private Long assetId;
	private String assetNo;
	private String assetName;
	private String categoryName;
	private LocalDateTime allocatedDate;
	private LocalDateTime returnDate;
	private String status;
	private String requestReason;
	private String adminComments;
	private LocalDateTime createdAt;
	private Boolean isAutoApproved;
}