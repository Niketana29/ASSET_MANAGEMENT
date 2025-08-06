package com.hexaware.assetManagement.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.assetManagement.entities.Employee;
import com.hexaware.assetManagement.repository.EmployeeRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class EmployeeServiceImpl implements IEmployeeService {

	
	@Autowired
	EmployeeRepository employeeRepo;
	
	@Override
	public Employee addEmployee(Employee employee) {
		// TODO Auto-generated method stub
        log.info("Service - addEmployee() called with: {}", employee);
		return employeeRepo.save(employee);
	}

	@Override
	public Employee updateEmployee(Employee employee) {
		// TODO Auto-generated method stub
        log.info("Service - updateEmployee() called with: {}", employee);
		return employeeRepo.save(employee);
	}

	@Override
	public Employee getEmployeeById(int eid) {
		// TODO Auto-generated method stub
        log.debug("Service - getEmployeeById() called with ID: {}", eid);
		return employeeRepo.findById(eid).orElse(null);
	}

	@Override
	public String deleteEmployee(int eid) {
		// TODO Auto-generated method stub
        log.warn("Service - deleteEmployee() called with ID: {}", eid);
		employeeRepo.deleteById(eid);
		
		return "Employee Record deleted successfully";
	}

	@Override
	public List<Employee> getAllEmployees() {
		// TODO Auto-generated method stub
        log.debug("Service - getAllEmployees() called");
		return employeeRepo.findAll();
	}

}
