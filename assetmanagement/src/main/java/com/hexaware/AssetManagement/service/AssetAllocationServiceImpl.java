package com.hexaware.AssetManagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.AssetManagement.entities.AssetAllocation;
import com.hexaware.AssetManagement.repository.AssetAllocationRepository;


@Service
public class AssetAllocationServiceImpl implements IAssetAllocationService {

	
	@Autowired
	AssetAllocationRepository allocationRepo;
	
	@Override
	public AssetAllocation allocateAsset(AssetAllocation allocation) {
		// TODO Auto-generated method stub
		return allocationRepo.save(allocation);
	}

	@Override
	public AssetAllocation updateAllocation(AssetAllocation allocation) {
		// TODO Auto-generated method stub
		return allocationRepo.save(allocation);
	}

	@Override
	public AssetAllocation getAllocationById(int allocId) {
		// TODO Auto-generated method stub
		return allocationRepo.findById(allocId).orElse(null);
	}

	@Override
	public String deleteAllocationById(int allocId) {
		// TODO Auto-generated method stub
		allocationRepo.deleteById(allocId);
		return "Allocation deleted successfully";
	}

	@Override
	public List<AssetAllocation> getAllAllocations() {
		// TODO Auto-generated method stub
		return allocationRepo.findAll();
	}

}
