package com.hexaware.AssetManagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.AssetManagement.entities.Employee;
import com.hexaware.AssetManagement.repository.EmployeeRepository;


@Service
public class EmployeeServiceImpl implements IEmployeeService {

	
	@Autowired
	EmployeeRepository employeeRepo;
	
	@Override
	public Employee addEmployee(Employee employee) {
		// TODO Auto-generated method stub
		return employeeRepo.save(employee);
	}

	@Override
	public Employee updateEmployee(Employee employee) {
		// TODO Auto-generated method stub
		return employeeRepo.save(employee);
	}

	@Override
	public Employee getEmployeeById(int eid) {
		// TODO Auto-generated method stub
		return employeeRepo.findById(eid).orElse(null);
	}

	@Override
	public String deleteEmployee(int eid) {
		// TODO Auto-generated method stub
		employeeRepo.deleteById(eid);
		
		return "Employee Record deleted successfully";
	}

	@Override
	public List<Employee> getAllEmployees() {
		// TODO Auto-generated method stub
		return employeeRepo.findAll();
	}

}
