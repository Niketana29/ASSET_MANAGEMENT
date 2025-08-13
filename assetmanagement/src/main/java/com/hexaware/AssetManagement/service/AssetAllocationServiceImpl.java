package com.hexaware.assetManagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.hexaware.assetManagement.entities.AssetAllocation;
import com.hexaware.assetManagement.exception.BusinessException;
import com.hexaware.assetManagement.exception.ResourceNotFoundException;
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
        if (allocation.getEmployee() == null) {
            throw new BusinessException("Employee must be provided for allocation");
        }
        if (allocation.getAsset() == null) {
            throw new BusinessException("Asset must be provided for allocation");
        }
        if (allocation.getAllocationDate() != null && allocation.getReturnDate() != null &&
            allocation.getReturnDate().before(allocation.getAllocationDate())) {
            throw new BusinessException("Return date cannot be before allocation date");
        }
		return allocationRepo.save(allocation);
	}

	@Override
	public AssetAllocation updateAllocation(AssetAllocation allocation) {
		// TODO Auto-generated method stub
        log.info("Service - updateAllocation() called with: {}", allocation);
        if (!allocationRepo.existsById(allocation.getAllocId())) {
            throw new ResourceNotFoundException(HttpStatus.NOT_FOUND, "Cannot update — Allocation not found with ID: " + allocation.getAllocId());
        }
        
        if (allocation.getReturnDate() != null && allocation.getAllocationDate() != null &&
                allocation.getReturnDate().before(allocation.getAllocationDate())) {
                throw new BusinessException("Return date cannot be before allocation date");
        }
		return allocationRepo.save(allocation);
	}

	@Override
	public AssetAllocation getAllocationById(int allocId) {
		// TODO Auto-generated method stub
        log.debug("Service - getAllocationById() called with ID: {}", allocId);
		return allocationRepo.findById(allocId).orElseThrow(() -> new ResourceNotFoundException(HttpStatus.NOT_FOUND, "Allocation not found with ID: " + allocId));
	}

	@Override
	public String deleteAllocationById(int allocId) {
		// TODO Auto-generated method stub
        log.warn("Service - deleteAllocationById() called with ID: {}", allocId);
        if (!allocationRepo.existsById(allocId)) {
            throw new ResourceNotFoundException(HttpStatus.NOT_FOUND, "Cannot delete — Allocation not found with ID: " + allocId);
        }
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
