package com.hexaware.assetManagement.restcontroller;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.client.RestTemplate;

import com.hexaware.assetManagement.dto.EmployeeDto;
import com.hexaware.assetManagement.entities.Employee;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
class EmployeeRestControllerTest {

	
	@Autowired
	RestTemplate restTemplate;
	
	Logger logger = LoggerFactory.getLogger(EmployeeRestControllerTest.class);

    String baseURL = "http://localhost:8092/api/employees";
	
    @Test
    void testAddEmployee() {
        EmployeeDto dto = new EmployeeDto();
        dto.setEname("John Doe");
        dto.setEid(101);

        Employee savedEmployee = restTemplate.postForObject(baseURL + "/add", dto, Employee.class);

        logger.info("Saved Employee: {}", savedEmployee);
        assertNotNull(savedEmployee);
    }

    @Test
    void testGetAllEmployees() {
        List<?> employees = restTemplate.getForObject(baseURL + "/getall", List.class);

        logger.info("Employees List: {}", employees);
        assertNotNull(employees);
        assertTrue(employees.size() > 0);
    }
}
