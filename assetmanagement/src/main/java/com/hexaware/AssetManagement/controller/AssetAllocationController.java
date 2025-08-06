package com.hexaware.assetManagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hexaware.assetManagement.entities.AssetAllocation;
import com.hexaware.assetManagement.service.IAssetAllocationService;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@RequestMapping("/api/allocations")
public class AssetAllocationController {
	
	@Autowired
	IAssetAllocationService allocationService;
	
	@PostMapping("/insert")
    public AssetAllocation allocateAsset(@RequestBody AssetAllocation allocation) {
        log.info("POST /insert - Allocating asset: {}", allocation);
        return allocationService.allocateAsset(allocation);
    }


    @PutMapping("/update")
    public AssetAllocation updateAllocation(@RequestBody AssetAllocation allocation) {
        log.info("PUT /update - Updating asset allocation: {}", allocation);
        return allocationService.updateAllocation(allocation);
    }


    @GetMapping("/getbyid/{allocId}")
    public AssetAllocation getAllocationById(@PathVariable int allocId) {
        log.info("GET /getbyid/{} - Fetching asset allocation by ID", allocId);
        return allocationService.getAllocationById(allocId);
    }


    @DeleteMapping("/deletebyid/{allocId}")
    public String deleteAllocation(@PathVariable int allocId) {
        log.warn("DELETE /deletebyid/{} - Deleting asset allocation", allocId);
        allocationService.deleteAllocationById(allocId);
        return "Asset Allocation with ID " + allocId + " deleted successfully.";
    }


    @GetMapping("/getall")
    public List<AssetAllocation> getAllAllocations() {
        log.info("GET /getall - Fetching all asset allocations");
        return allocationService.getAllAllocations();
    }

}
