package com.hexaware.AssetManagement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hexaware.AssetManagement.entities.Asset;
import com.hexaware.AssetManagement.entities.Asset.AssetStatus;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
	Optional<Asset> findByAssetNo(String assetNo);

	boolean existsByAssetNo(String assetNo);

	List<Asset> findByStatus(AssetStatus status);

	@Query("SELECT a FROM Asset a WHERE a.category.categoryId = :categoryId")
	List<Asset> findByCategoryId(@Param("categoryId") Long categoryId);

	@Query("SELECT a FROM Asset a WHERE LOWER(a.assetName) LIKE LOWER(CONCAT('%', :assetName, '%'))")
	List<Asset> findByAssetNameContainingIgnoreCase(@Param("assetName") String assetName);

	@Query("SELECT a FROM Asset a WHERE a.status = :status AND LOWER(a.assetName) LIKE LOWER(CONCAT('%', :assetName, '%'))")
	List<Asset> findByStatusAndAssetNameContainingIgnoreCase(@Param("status") AssetStatus status,
			@Param("assetName") String assetName);
}