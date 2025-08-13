package com.hexaware.assetManagement.service;


import java.util.List;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.hexaware.assetManagement.entities.Employee;
import com.hexaware.assetManagement.exception.BusinessException;
import com.hexaware.assetManagement.exception.ResourceNotFoundException;
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
        
        if (employee.getEname() == null || employee.getEname().trim().isEmpty()) {
            throw new BusinessException("Employee name cannot be empty");
        }
        if (employee.getContactNumber() == null || !Pattern.matches("\\d{10}", employee.getContactNumber())) {
            throw new BusinessException("Contact number must be 10 digits");
        }
		return employeeRepo.save(employee);
	}

	@Override
	public Employee updateEmployee(Employee employee) {
		// TODO Auto-generated method stub
        log.info("Service - updateEmployee() called with: {}", employee);
        if (!employeeRepo.existsById(employee.getEid())) {
            throw new ResourceNotFoundException(HttpStatus.NOT_FOUND, "Cannot update — Employee not found with ID: " + employee.getEid());
        }
        
		return employeeRepo.save(employee);
	}

	@Override
	public Employee getEmployeeById(int eid) {
		// TODO Auto-generated method stub
        log.debug("Service - getEmployeeById() called with ID: {}", eid);
		return employeeRepo.findById(eid).orElseThrow(() -> new ResourceNotFoundException(HttpStatus.NOT_FOUND, "Employee not found with ID: " + eid));
	}

	@Override
	public String deleteEmployee(int eid) {
		// TODO Auto-generated method stub
        log.warn("Service - deleteEmployee() called with ID: {}", eid);
        
        if (!employeeRepo.existsById(eid)) {
            throw new ResourceNotFoundException(HttpStatus.NOT_FOUND, "Cannot delete — Employee not found with ID: " + eid);
        }
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
