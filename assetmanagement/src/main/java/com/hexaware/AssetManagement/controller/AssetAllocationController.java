package com.hexaware.AssetManagement.controller;

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

import com.hexaware.AssetManagement.entities.AssetAllocation;
import com.hexaware.AssetManagement.service.IAssetAllocationService;

@RestController
@RequestMapping("/api/allocations")
public class AssetAllocationController {
	
	@Autowired
	IAssetAllocationService allocationService;
	
	@PostMapping("/insert")
    public AssetAllocation allocateAsset(@RequestBody AssetAllocation allocation) {
        return allocationService.allocateAsset(allocation);
    }


    @PutMapping("/update")
    public AssetAllocation updateAllocation(@RequestBody AssetAllocation allocation) {
        return allocationService.updateAllocation(allocation);
    }


    @GetMapping("/getbyid/{allocId}")
    public AssetAllocation getAllocationById(@PathVariable int allocId) {
        return allocationService.getAllocationById(allocId);
    }


    @DeleteMapping("/deletebyid/{allocId}")
    public String deleteAllocation(@PathVariable int allocId) {
        allocationService.deleteAllocationById(allocId);
        return "Asset Allocation with ID " + allocId + " deleted successfully.";
    }


    @GetMapping("/getall")
    public List<AssetAllocation> getAllAllocations() {
        return allocationService.getAllAllocations();
    }

}
