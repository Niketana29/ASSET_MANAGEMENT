package com.hexaware.assetManagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hexaware.assetManagement.dto.EmployeeDto;
import com.hexaware.assetManagement.entities.Employee;
import com.hexaware.assetManagement.service.IEmployeeService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
	
	@Autowired
	IEmployeeService employeeService;
	
	 @PostMapping("/insert")
	 @PreAuthorize("hasAuthority('ADMIN')")
	 public Employee addEmployee(@Valid @RequestBody EmployeeDto employeeDto) {
	        log.info("POST /insert - Adding employee: {}", employeeDto);
	        return employeeService.addEmployee(mapDtoToEntity(employeeDto));
	 }
	
	 @PutMapping("/update")
	 @PreAuthorize("hasAuthority('ADMIN')")
	 public Employee updateEmployee(@Valid @RequestBody EmployeeDto employeeDto) {
	        log.info("PUT /update - Updating employee: {}", employeeDto);
	        return employeeService.updateEmployee(mapDtoToEntity(employeeDto));
	}
	
	@GetMapping("/getbyid/{eid}")
    @PreAuthorize("hasAnyAuthority('ADMIN' , 'USER')")
    public Employee getEmployeeById(@PathVariable int eid) {
        log.info("GET /getbyid/{} - Fetching employee by ID", eid);
        return employeeService.getEmployeeById(eid);
    }
	
	@DeleteMapping("deletebyid/{eid}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String deleteEmployee(@PathVariable int eid) {
        log.warn("DELETE /deletebyid/{} - Deleting employee by ID", eid);
        employeeService.deleteEmployee(eid);
        return "Employee with ID " + eid + " deleted successfully.";
    }
	
    @GetMapping("/getall")
    @PreAuthorize("hasAnyAuthority('ADMIN' , 'USER')")
    public List<Employee> getAllEmployees() {
        log.info("GET /getall - Fetching all employees");
        return employeeService.getAllEmployees();
    }
    
    private Employee mapDtoToEntity(EmployeeDto dto) {
        Employee e = new Employee();
        e.setEid(dto.getEid());
        e.setEname(dto.getEname());
        e.setEmail(dto.getEmail());
        e.setGender(dto.getGender());
        e.setContactNumber(dto.getContactNumber());
        e.setAddress(dto.getAddress());
        e.setRole(dto.getRole());
        return e;
    }
	
	

}
