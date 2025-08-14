package com.hexaware.assetManagement.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class AuditRequestDto {
	

    private Integer arid;

    @Min(1)
    private int eid;

    @Min(1)
    private int aid;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "PENDING|VERIFIED|REJECTED", message = "Status must be PENDING, VERIFIED, or REJECTED")
    private String status;

}
