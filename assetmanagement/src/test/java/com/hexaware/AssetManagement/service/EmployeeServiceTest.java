package com.hexaware.assetManagement.service;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.hexaware.assetManagement.entities.Employee;

@SpringBootTest
class EmployeeServiceTest {

    @Autowired
    private IEmployeeService employeeService;

    @Test
    void testAddEmployee() {
        Employee e = new Employee();
        e.setEname("John Doe");
        e.setEmail("john.doe@example.com");
        e.setGender("MALE");
        e.setContactNumber("9876543210");
        e.setAddress("123 Street, City");
        e.setRole("EMPLOYEE");

        Employee saved = employeeService.addEmployee(e);
        assertNotNull(saved);

        System.out.println("Added Employee: " + saved);
    }

    @Test
    void testGetAllEmployees() {
        var list = employeeService.getAllEmployees();
        assertNotNull(list);
        System.out.println("All Employees: " + list);
    }
}
