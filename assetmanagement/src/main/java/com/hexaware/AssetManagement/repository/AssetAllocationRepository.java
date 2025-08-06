package com.hexaware.assetManagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.assetManagement.entities.AssetAllocation;


@Repository //Integer = data type of primary key of entity class
public interface AssetAllocationRepository extends JpaRepository<AssetAllocation, Integer> {

}
