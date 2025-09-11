package com.hexaware.AssetManagement.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssetDto {
	private Long assetId;

	@NotBlank(message = "Asset number is required")
	@Size(min = 3, max = 50, message = "Asset number must be between 3 and 50 characters")
	@Pattern(regexp = "^[A-Z0-9-]+$", message = "Asset number should contain only uppercase letters, numbers, and hyphens")
	private String assetNo;

	@NotBlank(message = "Asset name is required")
	@Size(min = 2, max = 200, message = "Asset name must be between 2 and 200 characters")
	private String assetName;

	@NotNull(message = "Category ID is required")
	@Positive(message = "Category ID must be positive")
	private Long categoryId;

	private String categoryName;
	private Boolean isAutoApproved;

	@Size(max = 100, message = "Asset model must not exceed 100 characters")
	private String assetModel;

	@PastOrPresent(message = "Manufacturing date cannot be in the future")
	private LocalDate manufacturingDate;

	@Future(message = "Expiry date must be in the future")
	private LocalDate expiryDate;

	@DecimalMin(value = "0.0", inclusive = false, message = "Asset value must be greater than 0")
	@DecimalMax(value = "9999999.99", message = "Asset value must not exceed 9,999,999.99")
	private BigDecimal assetValue;

	@Pattern(regexp = "^(AVAILABLE|ALLOCATED|MAINTENANCE|RETIRED)$", message = "Status must be AVAILABLE, ALLOCATED, MAINTENANCE, or RETIRED")
	private String status;

	@Size(max = 1000, message = "Description must not exceed 1000 characters")
	private String description;
}