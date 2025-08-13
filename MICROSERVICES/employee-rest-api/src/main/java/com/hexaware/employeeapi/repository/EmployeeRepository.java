package com.hexaware.employeeapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hexaware.employeeapi.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

}
