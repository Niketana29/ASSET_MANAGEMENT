package com.hexaware.AssetManagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.AssetManagement.entities.Asset;


@Repository //Integer = data type of primary key of entity class
public interface AssetRepository extends JpaRepository<Asset, Integer> {

}
