package com.hexaware.AssetManagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hexaware.AssetManagement.dto.EmployeeDto;
import com.hexaware.AssetManagement.service.IEmployeeService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

	@Autowired
	private IEmployeeService employeeService;

	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<EmployeeDto>> getAllEmployees() {
		List<EmployeeDto> employees = employeeService.getAllEmployees();
		return ResponseEntity.ok(employees);
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and @employeeService.getEmployeeById(#id).email == authentication.name)")
	public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable Long id) {
		EmployeeDto employee = employeeService.getEmployeeById(id);
		return ResponseEntity.ok(employee);
	}

	@GetMapping("/email/{email}")
	@PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and #email == authentication.name)")
	public ResponseEntity<EmployeeDto> getEmployeeByEmail(@PathVariable String email) {
		EmployeeDto employee = employeeService.getEmployeeByEmail(email);
		return ResponseEntity.ok(employee);
	}

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<EmployeeDto> createEmployee(@Valid @RequestBody EmployeeDto employeeDto) {
		EmployeeDto createdEmployee = employeeService.createEmployee(employeeDto);
		return ResponseEntity.ok(createdEmployee);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<EmployeeDto> updateEmployee(@PathVariable Long id,
			@Valid @RequestBody EmployeeDto employeeDto) {
		EmployeeDto updatedEmployee = employeeService.updateEmployee(id, employeeDto);
		return ResponseEntity.ok(updatedEmployee);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
		employeeService.deleteEmployee(id);
		return ResponseEntity.ok().build();
	}
}