package com.hexaware.employeeapi.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.hexaware.employeeapi.dto.Asset;
import com.hexaware.employeeapi.dto.EmployeeAssetVO;
import com.hexaware.employeeapi.dto.EmployeeDto;
import com.hexaware.employeeapi.entity.Employee;
import com.hexaware.employeeapi.repository.EmployeeRepository;

@Service
public class EmployeeServiceImp implements IEmployeeService {

	
	@Autowired
	EmployeeRepository repo;
	
	@Autowired
    RestTemplate restTemplate;
	
	 @Override
	    public Employee addEmployee(EmployeeDto employeeDto) {
	        Employee employee = new Employee();
	        employee.setEmployeeId(employeeDto.getEmployeeId());
	        employee.setEmployeeName(employeeDto.getEmployeeName());
	        employee.setDateOfJoining(employeeDto.getDateOfJoining());
	        employee.setAssetId(employeeDto.getAssetId());
	        return repo.save(employee);
	    }

	    @Override
	    public EmployeeDto getEmployeeById(int employeeId) {
	        Employee employee = repo.findById(employeeId).orElse(null);
	        EmployeeDto dto = new EmployeeDto();
	        dto.setEmployeeId(employee.getEmployeeId());
	        dto.setEmployeeName(employee.getEmployeeName());
	        dto.setDateOfJoining(employee.getDateOfJoining());
	        dto.setAssetId(employee.getAssetId());
	        return dto;
	    }

	    @Override
	    public List<Employee> getAllEmployees() {
	        return repo.findAll();
	    }

	    @Override
	    public EmployeeAssetVO getEmployeeAndAssetById(int employeeId) {
	        EmployeeDto employee = getEmployeeById(employeeId);
	        int assetId = employee.getAssetId();
	        Asset asset = restTemplate.getForObject("http://localhost:8282/api/assets/get/" + assetId, Asset.class);
	        EmployeeAssetVO vo = new EmployeeAssetVO();
	        vo.setEmployee(employee);
	        vo.setAsset(asset);
	        return vo;
	    }

	    @Override
	    public void updateAssetByEmployee(Asset asset) {
	        restTemplate.put("http://localhost:8282/api/assets/update", asset);
	        System.out.println("Updated asset from employee MS");
	    }
	}


