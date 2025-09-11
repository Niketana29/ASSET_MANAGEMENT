package com.hexaware.AssetManagement.service;

import java.util.List;

import com.hexaware.AssetManagement.dto.EmployeeDto;

public interface IEmployeeService {
	public EmployeeDto createEmployee(EmployeeDto employeeDto);

	public EmployeeDto getEmployeeById(Long employeeId);

	public EmployeeDto getEmployeeByEmail(String email);

	public List<EmployeeDto> getAllEmployees();

	public EmployeeDto updateEmployee(Long employeeId, EmployeeDto employeeDto);

	public void deleteEmployee(Long employeeId);
}