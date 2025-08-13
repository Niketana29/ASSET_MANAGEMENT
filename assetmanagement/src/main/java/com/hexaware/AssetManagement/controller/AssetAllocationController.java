package com.hexaware.assetManagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hexaware.assetManagement.dto.AssetAllocationDto;
import com.hexaware.assetManagement.entities.Asset;
import com.hexaware.assetManagement.entities.AssetAllocation;
import com.hexaware.assetManagement.entities.Employee;
import com.hexaware.assetManagement.service.IAssetAllocationService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@RequestMapping("/api/allocations")
public class AssetAllocationController {
	
	@Autowired
	IAssetAllocationService allocationService;
	
	@PostMapping("/insert")
    @PreAuthorize("hasAuthority('ADMIN')")
    public AssetAllocation allocateAsset(@Valid @RequestBody AssetAllocationDto allocationDto) {
        log.info("POST /insert - Allocating asset: {}", allocationDto);
        return allocationService.allocateAsset(mapDtoToEntity(allocationDto));
    }


    @PutMapping("/update")
    @PreAuthorize("hasAuthority('ADMIN')")
    public AssetAllocation updateAllocation(@Valid @RequestBody AssetAllocationDto allocationDto) {
        log.info("PUT /update - Updating asset allocation: {}", allocationDto);
        return allocationService.updateAllocation(mapDtoToEntity(allocationDto));
    }


    @GetMapping("/getbyid/{allocId}")
    @PreAuthorize("hasAuthority('ADMIN' , 'USER')")
    public AssetAllocation getAllocationById(@PathVariable int allocId) {
        log.info("GET /getbyid/{} - Fetching asset allocation by ID", allocId);
        return allocationService.getAllocationById(allocId);
    }


    @DeleteMapping("/deletebyid/{allocId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String deleteAllocation(@PathVariable int allocId) {
        log.warn("DELETE /deletebyid/{} - Deleting asset allocation", allocId);
        allocationService.deleteAllocationById(allocId);
        return "Asset Allocation with ID " + allocId + " deleted successfully.";
    }


    @GetMapping("/getall")
    @PreAuthorize("hasAuthority('ADMIN' , 'USER')")
    public List<AssetAllocation> getAllAllocations() {
        log.info("GET /getall - Fetching all asset allocations");
        return allocationService.getAllAllocations();
    }
    
    private AssetAllocation mapDtoToEntity(AssetAllocationDto dto) {
        AssetAllocation allocation = new AssetAllocation();
        allocation.setAllocId(dto.getAllocId());

        Employee e = new Employee();
        e.setEid(dto.getEid());
        allocation.setEmployee(e);

        Asset a = new Asset();
        a.setAid(dto.getAid());
        allocation.setAsset(a);

        allocation.setAllocationDate(dto.getAllocationDate());
        allocation.setReturnDate(dto.getReturnDate());
        return allocation;
    }

}
