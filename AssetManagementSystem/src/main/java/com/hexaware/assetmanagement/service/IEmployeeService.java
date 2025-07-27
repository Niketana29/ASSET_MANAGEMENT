package com.hexaware.assetmanagement.service;

import java.util.List;

import com.hexaware.assetmanagement.pojo.Employee;

public interface IEmployeeService {
	
	public int addEmployee(Employee employee);
	
	public List<Employee> getAllEmployees();
	
	public int updateEmployee(Employee employee);
	
	public Employee selectById(int eid);
	
	public int deleteById(int eid);

}
