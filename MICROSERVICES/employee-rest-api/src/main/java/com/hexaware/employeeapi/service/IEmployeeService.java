package com.hexaware.employeeapi.service;

import java.util.List;

import com.hexaware.employeeapi.dto.Asset;
import com.hexaware.employeeapi.dto.EmployeeAssetVO;
import com.hexaware.employeeapi.dto.EmployeeDto;
import com.hexaware.employeeapi.entity.Employee;

public interface IEmployeeService {
	
    public Employee addEmployee(EmployeeDto employeeDto);

    public EmployeeDto getEmployeeById(int employeeId);

    public List<Employee> getAllEmployees();

    public EmployeeAssetVO getEmployeeAndAssetById(int employeeId);

    public void updateAssetByEmployee(Asset asset);

}
