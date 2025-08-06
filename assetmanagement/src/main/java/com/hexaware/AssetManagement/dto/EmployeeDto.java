package com.hexaware.assetManagement.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data 
public class EmployeeDto {
	
    @Min(1)
    private int eid;

    @NotNull
    @Size(min = 2, max = 30)
    private String ename;

    @Email(message = "Invalid email format")
    private String email;

    @Pattern(regexp = "MALE|FEMALE", message = "Gender must be either MALE or FEMALE")
    private String gender;

    @Pattern(regexp = "[0-9]{10}", message = "Contact number must be a 10-digit number")
    private String contactNumber;

    @NotEmpty
    private String address;

    @Pattern(regexp = "EMPLOYEE|ADMIN", message = "Role must be EMPLOYEE or ADMIN")
    private String role;
	
	

}
