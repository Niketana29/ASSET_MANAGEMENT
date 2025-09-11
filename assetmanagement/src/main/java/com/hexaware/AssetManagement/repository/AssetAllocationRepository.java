package com.hexaware.AssetManagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hexaware.AssetManagement.entities.AssetAllocation;
import com.hexaware.AssetManagement.entities.AssetAllocation.AllocationStatus;

@Repository
public interface AssetAllocationRepository extends JpaRepository<AssetAllocation, Long> {

	@Query("SELECT aa FROM AssetAllocation aa WHERE aa.employee.employeeId = :employeeId ORDER BY aa.createdAt DESC")
	List<AssetAllocation> findByEmployeeId(@Param("employeeId") Long employeeId);

	@Query("SELECT aa FROM AssetAllocation aa WHERE aa.asset.assetId = :assetId ORDER BY aa.createdAt DESC")
	List<AssetAllocation> findByAssetId(@Param("assetId") Long assetId);

	@Query("SELECT aa FROM AssetAllocation aa WHERE aa.status = :status ORDER BY aa.createdAt DESC")
	List<AssetAllocation> findByStatus(@Param("status") AllocationStatus status);

	@Query("SELECT aa FROM AssetAllocation aa WHERE aa.employee.employeeId = :employeeId AND aa.status = :status ORDER BY aa.createdAt DESC")
	List<AssetAllocation> findByEmployeeIdAndStatus(@Param("employeeId") Long employeeId,
			@Param("status") AllocationStatus status);

	@Query("SELECT aa FROM AssetAllocation aa WHERE aa.asset.assetId = :assetId AND aa.status IN ('APPROVED', 'REQUESTED') ORDER BY aa.createdAt DESC")
	List<AssetAllocation> findActiveAllocationsByAssetId(@Param("assetId") Long assetId);

	@Query("SELECT aa FROM AssetAllocation aa JOIN FETCH aa.employee JOIN FETCH aa.asset JOIN FETCH aa.asset.category ORDER BY aa.createdAt DESC")
	List<AssetAllocation> findAllWithDetails();

	@Query("SELECT aa FROM AssetAllocation aa JOIN FETCH aa.employee JOIN FETCH aa.asset JOIN FETCH aa.asset.category WHERE aa.status = :status ORDER BY aa.createdAt DESC")
	List<AssetAllocation> findByStatusWithDetails(@Param("status") AllocationStatus status);
}