package com.hexaware.assetmanagement.dao;

import java.util.List;

import com.hexaware.assetmanagement.pojo.Employee;

public interface IEmployeeDao {
	
	public int addEmployee(Employee employee);
	
	public List<Employee> getAllEmployees();
	
	public int updateEmployee(Employee employee);
	
	public Employee selectById(int eid);
	
	public int deleteById(int eid);

}
