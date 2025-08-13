package com.hexaware.employeeapi.restcontroller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hexaware.employeeapi.dto.Asset;
import com.hexaware.employeeapi.dto.EmployeeAssetVO;
import com.hexaware.employeeapi.dto.EmployeeDto;
import com.hexaware.employeeapi.entity.Employee;
import com.hexaware.employeeapi.service.IEmployeeService;

@RestController
@RequestMapping("/api/employees")
public class EmployeeRestController {
	
    @Autowired
    IEmployeeService service;

    @PostMapping(value="/add", produces="application/json", consumes="application/json")
    public Employee addEmployee(@RequestBody EmployeeDto employeeDto) {
        return service.addEmployee(employeeDto);
    }

    @GetMapping("/get/{employeeId}")
    public EmployeeDto getEmployeeById(@PathVariable int employeeId) {
        return service.getEmployeeById(employeeId);
    }

    @GetMapping("/getall")
    public List<Employee> getAllEmployees() {
        return service.getAllEmployees();
    }

    @GetMapping("/get/employee-asset/{employeeId}")
    public EmployeeAssetVO getEmployeeAndAssetById(@PathVariable int employeeId) {
        return service.getEmployeeAndAssetById(employeeId);
    }

    @PutMapping("/update/asset-by-employee")
    public String updateAssetByEmployee(@RequestBody Asset asset) {
        service.updateAssetByEmployee(asset);
        return "Asset updated by employee.";
    }

}
