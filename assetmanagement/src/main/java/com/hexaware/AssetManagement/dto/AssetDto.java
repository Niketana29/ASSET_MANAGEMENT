package com.hexaware.assetManagement.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data 
public class AssetDto {
	
	private Integer aid;
	
	@NotBlank(message = "Asset number is required")
    private String assetNo;
    
    @NotNull
    @Size(min = 3, max = 50, message = "Asset name must be between 3 and 50 characters")
    private String aname;
    
    @NotNull 
    @NotEmpty
    private String category;

    @NotNull
    @NotEmpty
    private String model;

    @NotNull
    @FutureOrPresent(message = "Manufacturing date must be present or future")
    private LocalDate manufacturingDate;

    @NotNull
    @FutureOrPresent(message = "Expiry date must be present or future")
    private LocalDate expiryDate;

    @Min(value = 1000)
    private double assetValue;
    
    @NotNull
    @Pattern(regexp = "AVAILABLE|ASSIGNED|UNDER_SERVICE", message = "Status must be AVAILABLE, ASSIGNED or UNDER_SERVICE")
    private String status;

}
