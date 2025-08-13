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

import com.hexaware.assetManagement.dto.AssetDto;
import com.hexaware.assetManagement.entities.Asset;
import com.hexaware.assetManagement.service.IAssetService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@RequestMapping("/api/assets")
public class AssetController {
	
	@Autowired
	IAssetService assetService;
	
	@PostMapping("/insert")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Asset addAsset(@Valid @RequestBody AssetDto assetDto) {
        log.info("POST /insert - Adding asset: {}", assetDto);
        return assetService.addAsset(mapDtoToEntity(assetDto));
    }

    @PutMapping("/update")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Asset updateAsset(@Valid @RequestBody AssetDto assetDto) {
        log.info("PUT /update - Updating asset: {}", assetDto);
        return assetService.updateAsset(mapDtoToEntity(assetDto));
    }

 
    @GetMapping("/getbyid/{aid}")
    @PreAuthorize("hasAuthority('ADMIN' , 'USER')")
    public Asset getAssetById(@PathVariable int aid) {
        log.info("GET /getbyid/{} - Fetching asset by ID", aid);
        return assetService.getAssetById(aid);
    }


    @DeleteMapping("/deletebyid/{aid}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String deleteAsset(@PathVariable int aid) {
        log.warn("DELETE /deletebyid/{} - Deleting asset by ID", aid);
        assetService.deleteAssetById(aid);
        return "Asset with ID " + aid + " deleted successfully.";
    }


    @GetMapping("/getall")
    @PreAuthorize("hasAuthority('ADMIN' , 'USER')")
    public List<Asset> getAllAssets() {
        log.info("GET /getall - Fetching all assets");
        return assetService.getAllAssets();
    }
	
    private Asset mapDtoToEntity(AssetDto dto) {
        Asset a = new Asset();
        a.setAid(dto.getAid());
        a.setAssetNo(dto.getAssetNo());
        a.setAname(dto.getAname());
        a.setCategory(dto.getCategory());
        a.setModel(dto.getModel());
        a.setManufacturingDate(java.sql.Date.valueOf(dto.getManufacturingDate()));
        a.setExpiryDate(java.sql.Date.valueOf(dto.getExpiryDate()));
        a.setAssetValue(dto.getAssetValue());
        a.setStatus(dto.getStatus());
        return a;
    }

}
