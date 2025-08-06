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

import com.hexaware.assetManagement.entities.Asset;
import com.hexaware.assetManagement.service.IAssetService;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@RequestMapping("/api/assets")
public class AssetController {
	
	@Autowired
	IAssetService assetService;
	
    @PostMapping("/insert")
    public Asset addAsset(@RequestBody Asset asset) {
    	log.info("POST /insert - Adding asset: {}", asset);
        return assetService.addAsset(asset);
    }

 
    @PutMapping("/update")
    public Asset updateAsset(@RequestBody Asset asset) {
        log.info("PUT /update - Updating asset: {}", asset);
        return assetService.updateAsset(asset);
    }

 
    @GetMapping("/getbyid/{aid}")
    public Asset getAssetById(@PathVariable int aid) {
        log.info("GET /getbyid/{} - Fetching asset by ID", aid);
        return assetService.getAssetById(aid);
    }


    @DeleteMapping("/deletebyid/{aid}")
    public String deleteAsset(@PathVariable int aid) {
        log.warn("DELETE /deletebyid/{} - Deleting asset by ID", aid);
        assetService.deleteAssetById(aid);
        return "Asset with ID " + aid + " deleted successfully.";
    }


    @GetMapping("/getall")
    public List<Asset> getAllAssets() {
        log.info("GET /getall - Fetching all assets");
        return assetService.getAllAssets();
    }
	

}
