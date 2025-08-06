package com.hexaware.assetManagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.assetManagement.entities.AssetAllocation;
import com.hexaware.assetManagement.repository.AssetAllocationRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AssetAllocationServiceImpl implements IAssetAllocationService {

	
	@Autowired
	AssetAllocationRepository allocationRepo;
	
	@Override
	public AssetAllocation allocateAsset(AssetAllocation allocation) {
		// TODO Auto-generated method stub
        log.info("Service - allocateAsset() called with: {}", allocation);
		return allocationRepo.save(allocation);
	}

	@Override
	public AssetAllocation updateAllocation(AssetAllocation allocation) {
		// TODO Auto-generated method stub
        log.info("Service - updateAllocation() called with: {}", allocation);
		return allocationRepo.save(allocation);
	}

	@Override
	public AssetAllocation getAllocationById(int allocId) {
		// TODO Auto-generated method stub
        log.debug("Service - getAllocationById() called with ID: {}", allocId);
		return allocationRepo.findById(allocId).orElse(null);
	}

	@Override
	public String deleteAllocationById(int allocId) {
		// TODO Auto-generated method stub
        log.warn("Service - deleteAllocationById() called with ID: {}", allocId);
		allocationRepo.deleteById(allocId);
		return "Allocation deleted successfully";
	}

	@Override
	public List<AssetAllocation> getAllAllocations() {
		// TODO Auto-generated method stub
        log.debug("Service - getAllAllocations() called");
		return allocationRepo.findAll();
	}

}
