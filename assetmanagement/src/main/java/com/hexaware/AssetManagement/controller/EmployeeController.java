package com.hexaware.assetManagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hexaware.assetManagement.entities.Employee;
import com.hexaware.assetManagement.service.IEmployeeService;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
	
	@Autowired
	IEmployeeService employeeService;
	
	@PostMapping("/insert")
    public Employee addEmployee(@RequestBody Employee employee) {
        log.info("POST /insert - Adding employee: {}", employee);
        return employeeService.addEmployee(employee);
    }
	
	@PutMapping("/update")
    public Employee updateEmployee(@RequestBody Employee employee) {
        log.info("PUT /update - Updating employee: {}", employee);
        return employeeService.updateEmployee(employee);
    }
	
	@GetMapping("/getbyid/{eid}")
    public Employee getEmployeeById(@PathVariable int eid) {
        log.info("GET /getbyid/{} - Fetching employee by ID", eid);
        return employeeService.getEmployeeById(eid);
    }
	
	@DeleteMapping("deletebyid/{eid}")
    public String deleteEmployee(@PathVariable int eid) {
        log.warn("DELETE /deletebyid/{} - Deleting employee by ID", eid);
        employeeService.deleteEmployee(eid);
        return "Employee with ID " + eid + " deleted successfully.";
    }
	
    @GetMapping("/getall")
    public List<Employee> getAllEmployees() {
        log.info("GET /getall - Fetching all employees");
        return employeeService.getAllEmployees();
    }
	
	

}
