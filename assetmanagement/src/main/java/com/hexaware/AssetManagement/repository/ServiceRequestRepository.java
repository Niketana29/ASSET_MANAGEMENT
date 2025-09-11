package com.hexaware.AssetManagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hexaware.AssetManagement.entities.ServiceRequest;
import com.hexaware.AssetManagement.entities.ServiceRequest.ServiceStatus;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

	@Query("SELECT sr FROM ServiceRequest sr WHERE sr.employee.employeeId = :employeeId ORDER BY sr.createdAt DESC")
	List<ServiceRequest> findByEmployeeId(@Param("employeeId") Long employeeId);

	@Query("SELECT sr FROM ServiceRequest sr WHERE sr.asset.assetId = :assetId ORDER BY sr.createdAt DESC")
	List<ServiceRequest> findByAssetId(@Param("assetId") Long assetId);

	@Query("SELECT sr FROM ServiceRequest sr WHERE sr.status = :status ORDER BY sr.createdAt DESC")
	List<ServiceRequest> findByStatus(@Param("status") ServiceStatus status);

	@Query("SELECT sr FROM ServiceRequest sr WHERE sr.assetNo = :assetNo ORDER BY sr.createdAt DESC")
	List<ServiceRequest> findByAssetNo(@Param("assetNo") String assetNo);

	@Query("SELECT sr FROM ServiceRequest sr JOIN FETCH sr.employee JOIN FETCH sr.asset ORDER BY sr.createdAt DESC")
	List<ServiceRequest> findAllWithDetails();

	@Query("SELECT sr FROM ServiceRequest sr JOIN FETCH sr.employee JOIN FETCH sr.asset WHERE sr.status = :status ORDER BY sr.createdAt DESC")
	List<ServiceRequest> findByStatusWithDetails(@Param("status") ServiceStatus status);
}