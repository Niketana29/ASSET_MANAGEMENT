package com.hexaware.assetManagement.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class ServiceRequestDto {
	

    @Min(1)
    private int srid;

    @Min(1)
    @NotEmpty
    private int eid;

    @Min(1)
    @NotEmpty
    private int aid;

    @NotEmpty(message = "Description cannot be empty")
    private String description;

    @Pattern(regexp = "MALFUNCTION|REPAIR", message = "Issue type must be MALFUNCTION or REPAIR")
    private String issueType;

    @Pattern(regexp = "PENDING|IN_PROGRESS|COMPLETED", message = "Status must be PENDING, IN_PROGRESS, or COMPLETED")
    private String status;

}
