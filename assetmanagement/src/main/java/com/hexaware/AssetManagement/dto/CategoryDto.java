package com.hexaware.AssetManagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDto {
	private Long categoryId;

	@NotBlank(message = "Category name is required")
	@Size(min = 2, max = 100, message = "Category name must be between 2 and 100 characters")
	@Pattern(regexp = "^[a-zA-Z0-9\\s&.-]+$", message = "Category name can only contain letters, numbers, spaces, ampersand, dots, and hyphens")
	private String categoryName;

	@Size(max = 500, message = "Description must not exceed 500 characters")
	private String description;

	@NotNull(message = "Auto approval flag is required")
	private Boolean isAutoApproved = false;
}