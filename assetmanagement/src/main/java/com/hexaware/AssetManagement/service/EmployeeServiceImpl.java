package com.hexaware.AssetManagement.service;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hexaware.AssetManagement.dto.EmployeeDto;
import com.hexaware.AssetManagement.entities.Employee;
import com.hexaware.AssetManagement.exception.BusinessException;
import com.hexaware.AssetManagement.exception.ResourceNotFoundException;
import com.hexaware.AssetManagement.repository.EmployeeRepository;

@Service
@Transactional
public class EmployeeServiceImpl implements IEmployeeService {

	private static final Logger logger = LoggerFactory.getLogger(EmployeeServiceImpl.class);

	@Autowired
	private EmployeeRepository employeeRepository;

	@Override
	public EmployeeDto createEmployee(EmployeeDto employeeDto) {
		logger.info("Creating employee: {}", employeeDto.getEmployeeName());

		if (employeeRepository.existsByEmail(employeeDto.getEmail())) {
			throw new BusinessException("Employee with email already exists: " + employeeDto.getEmail());
		}

		Employee employee = convertToEntity(employeeDto);
		Employee savedEmployee = employeeRepository.save(employee);

		logger.info("Employee created successfully with ID: {}", savedEmployee.getEmployeeId());
		return convertToDto(savedEmployee);
	}

	@Override
	public EmployeeDto getEmployeeById(Long employeeId) {
		Employee employee = employeeRepository.findById(employeeId)
				.orElseThrow(() -> new ResourceNotFoundException("Employee", "id", employeeId));
		return convertToDto(employee);
	}

	@Override
	public EmployeeDto getEmployeeByEmail(String email) {
		Employee employee = employeeRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Employee", "email", email));
		return convertToDto(employee);
	}

	@Override
	public List<EmployeeDto> getAllEmployees() {
		return employeeRepository.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
	}

	@Override
	public EmployeeDto updateEmployee(Long employeeId, EmployeeDto employeeDto) {
		logger.info("Updating employee with ID: {}", employeeId);

		Employee existingEmployee = employeeRepository.findById(employeeId)
				.orElseThrow(() -> new ResourceNotFoundException("Employee", "id", employeeId));

		// Check if email is being changed and if new email already exists
		if (!existingEmployee.getEmail().equals(employeeDto.getEmail())
				&& employeeRepository.existsByEmail(employeeDto.getEmail())) {
			throw new BusinessException("Employee with email already exists: " + employeeDto.getEmail());
		}

		existingEmployee.setEmployeeName(employeeDto.getEmployeeName());
		existingEmployee.setEmail(employeeDto.getEmail());
		existingEmployee.setContactNumber(employeeDto.getContactNumber());
		existingEmployee.setGender(employeeDto.getGender());
		existingEmployee.setAddress(employeeDto.getAddress());

		Employee updatedEmployee = employeeRepository.save(existingEmployee);

		logger.info("Employee updated successfully: {}", employeeId);
		return convertToDto(updatedEmployee);
	}

	@Override
	public void deleteEmployee(Long employeeId) {
		logger.info("Deleting employee with ID: {}", employeeId);

		if (!employeeRepository.existsById(employeeId)) {
			throw new ResourceNotFoundException("Employee", "id", employeeId);
		}

		employeeRepository.deleteById(employeeId);
		logger.info("Employee deleted successfully: {}", employeeId);
	}

	private EmployeeDto convertToDto(Employee employee) {
		EmployeeDto dto = new EmployeeDto();
		dto.setEmployeeId(employee.getEmployeeId());
		dto.setEmployeeName(employee.getEmployeeName());
		dto.setEmail(employee.getEmail());
		dto.setContactNumber(employee.getContactNumber());
		dto.setGender(employee.getGender());
		dto.setAddress(employee.getAddress());
		dto.setCreatedAt(employee.getCreatedAt());
		dto.setUpdatedAt(employee.getUpdatedAt());
		return dto;
	}

	private Employee convertToEntity(EmployeeDto dto) {
		Employee employee = new Employee();
		employee.setEmployeeName(dto.getEmployeeName());
		employee.setEmail(dto.getEmail());
		employee.setContactNumber(dto.getContactNumber());
		employee.setGender(dto.getGender());
		employee.setAddress(dto.getAddress());
		return employee;
	}
}