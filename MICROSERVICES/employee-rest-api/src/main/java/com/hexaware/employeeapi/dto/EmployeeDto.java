package com.hexaware.employeeapi.dto;

import java.time.LocalDate;

public class EmployeeDto {
	
    private int employeeId;
    private String employeeName;
    private LocalDate dateOfJoining;
    private int assetId;
	public EmployeeDto() {
		super();
		// TODO Auto-generated constructor stub
	}
	public EmployeeDto(int employeeId, String employeeName, LocalDate dateOfJoining, int assetId) {
		super();
		this.employeeId = employeeId;
		this.employeeName = employeeName;
		this.dateOfJoining = dateOfJoining;
		this.assetId = assetId;
	}
	public int getEmployeeId() {
		return employeeId;
	}
	public void setEmployeeId(int employeeId) {
		this.employeeId = employeeId;
	}
	public String getEmployeeName() {
		return employeeName;
	}
	public void setEmployeeName(String employeeName) {
		this.employeeName = employeeName;
	}
	public LocalDate getDateOfJoining() {
		return dateOfJoining;
	}
	public void setDateOfJoining(LocalDate dateOfJoining) {
		this.dateOfJoining = dateOfJoining;
	}
	public int getAssetId() {
		return assetId;
	}
	public void setAssetId(int assetId) {
		this.assetId = assetId;
	}
    
    

}
