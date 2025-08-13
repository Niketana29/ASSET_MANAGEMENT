package com.hexaware.employeeapi.dto;

public class EmployeeAssetVO {
	
    private EmployeeDto employee;
    private Asset asset;
    
	public EmployeeAssetVO() {
		super();
		// TODO Auto-generated constructor stub
	}

	public EmployeeAssetVO(EmployeeDto employee, Asset asset) {
		super();
		this.employee = employee;
		this.asset = asset;
	}

	public EmployeeDto getEmployee() {
		return employee;
	}

	public void setEmployee(EmployeeDto employee) {
		this.employee = employee;
	}

	public Asset getAsset() {
		return asset;
	}

	public void setAsset(Asset asset) {
		this.asset = asset;
	}
    
    

}
