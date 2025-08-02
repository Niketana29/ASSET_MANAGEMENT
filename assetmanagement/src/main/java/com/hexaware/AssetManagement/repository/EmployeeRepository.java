package com.hexaware.AssetManagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.AssetManagement.entities.Employee;


@Repository //Integer = data type of primary key of entity class
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
	
	

}
