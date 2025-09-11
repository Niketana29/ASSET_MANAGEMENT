package com.hexaware.AssetManagement.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServiceRequestResponseDto {
	private Long requestId;
	private Long employeeId;
	private String employeeName;
	private String employeeEmail;
	private Long assetId;
	private String assetNo;
	private String assetName;
	private String description;
	private String issueType;
	private String status;
	private String adminComments;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}