package com.hexaware.AssetManagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hexaware.AssetManagement.entities.AuditRequest;
import com.hexaware.AssetManagement.entities.AuditRequest.AuditStatus;

@Repository
public interface AuditRequestRepository extends JpaRepository<AuditRequest, Long> {

	@Query("SELECT ar FROM AuditRequest ar WHERE ar.employee.employeeId = :employeeId ORDER BY ar.createdAt DESC")
	List<AuditRequest> findByEmployeeId(@Param("employeeId") Long employeeId);

	@Query("SELECT ar FROM AuditRequest ar WHERE ar.asset.assetId = :assetId ORDER BY ar.createdAt DESC")
	List<AuditRequest> findByAssetId(@Param("assetId") Long assetId);

	@Query("SELECT ar FROM AuditRequest ar WHERE ar.status = :status ORDER BY ar.createdAt DESC")
	List<AuditRequest> findByStatus(@Param("status") AuditStatus status);

	@Query("SELECT ar FROM AuditRequest ar JOIN FETCH ar.employee JOIN FETCH ar.asset ORDER BY ar.createdAt DESC")
	List<AuditRequest> findAllWithDetails();

	@Query("SELECT ar FROM AuditRequest ar JOIN FETCH ar.employee JOIN FETCH ar.asset WHERE ar.status = :status ORDER BY ar.createdAt DESC")
	List<AuditRequest> findByStatusWithDetails(@Param("status") AuditStatus status);

	@Query("SELECT ar FROM AuditRequest ar WHERE ar.employee.employeeId = :employeeId AND ar.asset.assetId = :assetId")
	List<AuditRequest> findByEmployeeIdAndAssetId(@Param("employeeId") Long employeeId, @Param("assetId") Long assetId);
}