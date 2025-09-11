package com.hexaware.AssetManagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssetRequestDto {
    @NotNull(message = "Employee ID is required")
    @Positive(message = "Employee ID must be positive")
    private Long employeeId;
    
    @NotBlank(message = "Asset name is required")
    @Size(min = 2, max = 200, message = "Asset name must be between 2 and 200 characters")
    private String assetName;
    
    @Size(max = 500, message = "Request reason must not exceed 500 characters")
    private String requestReason;
    
    @Positive(message = "Category ID must be positive")
    private Long categoryId;
}