package com.hexaware.assetManagement.service;

import java.util.List;

import com.hexaware.assetManagement.entities.Employee;

public interface IEmployeeService {
	
    public Employee addEmployee(Employee employee);
    public Employee updateEmployee(Employee employee);
    
    public Employee getEmployeeById(int eid);
    public String deleteEmployee(int eid);
    
    public List<Employee> getAllEmployees();

}
