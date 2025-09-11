package com.hexaware.AssetManagement.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hexaware.AssetManagement.entities.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
	Optional<Employee> findByEmail(String email);

	boolean existsByEmail(String email);

	@Query("SELECT e FROM Employee e WHERE e.employeeId = :employeeId")
	Optional<Employee> findByEmployeeId(Long employeeId);
}
