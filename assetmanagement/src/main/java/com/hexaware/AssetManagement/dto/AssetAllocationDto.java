package com.hexaware.assetManagement.dto;

import java.time.LocalDate;
import java.util.Date;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class AssetAllocationDto {
	
    @Min(1)
    private int allocId;

    @Min(1)
    private int eid;

    @Min(1)
    private int aid;

    @NotNull(message = "Allocation date is required")
    @FutureOrPresent(message = "Allocation date must be today or in the future")
    private Date allocationDate;

    @FutureOrPresent(message = "Return date must be today or in the future")
    private Date returnDate;
    
    

}
