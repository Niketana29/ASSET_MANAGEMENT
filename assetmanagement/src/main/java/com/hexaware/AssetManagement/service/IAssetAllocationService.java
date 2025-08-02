package com.hexaware.AssetManagement.service;

import java.util.List;

import com.hexaware.AssetManagement.entities.AssetAllocation;

public interface IAssetAllocationService {
	
    public AssetAllocation allocateAsset(AssetAllocation allocation);
    public AssetAllocation updateAllocation(AssetAllocation allocation);
    
    public AssetAllocation getAllocationById(int allocId);
    public String deleteAllocationById(int allocId);
    
    public List<AssetAllocation> getAllAllocations();

}
