package com.hexaware.assetapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.assetapi.entity.Asset;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Integer> {
	
	

}
