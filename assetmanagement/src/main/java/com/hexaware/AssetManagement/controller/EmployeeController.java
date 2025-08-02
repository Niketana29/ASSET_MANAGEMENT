package com.hexaware.AssetManagement.controller;

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

import com.hexaware.AssetManagement.entities.Employee;
import com.hexaware.AssetManagement.service.IEmployeeService;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
	
	@Autowired
	IEmployeeService employeeService;
	
	@PostMapping("/insert")
    public Employee addEmployee(@RequestBody Employee employee) {
        return employeeService.addEmployee(employee);
    }
	
	@PutMapping("/update")
    public Employee updateEmployee(@RequestBody Employee employee) {
        return employeeService.updateEmployee(employee);
    }
	
	@GetMapping("/getbyid/{eid}")
    public Employee getEmployeeById(@PathVariable int eid) {
        return employeeService.getEmployeeById(eid);
    }
	
	@DeleteMapping("deletebyid/{eid}")
    public String deleteEmployee(@PathVariable int eid) {
        employeeService.deleteEmployee(eid);
        return "Employee with ID " + eid + " deleted successfully.";
    }
	
    @GetMapping("/getall")
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }
	
	

}
