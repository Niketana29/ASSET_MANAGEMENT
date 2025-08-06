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

@RestController
@RequestMapping("/api/assets")
public class AssetController {
	
	@Autowired
	IAssetService assetService;
	
    @PostMapping("/insert")
    public Asset addAsset(@RequestBody Asset asset) {
        return assetService.addAsset(asset);
    }

 
    @PutMapping("/update")
    public Asset updateAsset(@RequestBody Asset asset) {
        return assetService.updateAsset(asset);
    }

 
    @GetMapping("/getbyid/{aid}")
    public Asset getAssetById(@PathVariable int aid) {
        return assetService.getAssetById(aid);
    }


    @DeleteMapping("/deletebyid/{aid}")
    public String deleteAsset(@PathVariable int aid) {
        assetService.deleteAssetById(aid);
        return "Asset with ID " + aid + " deleted successfully.";
    }


    @GetMapping("/getall")
    public List<Asset> getAllAssets() {
        return assetService.getAllAssets();
    }
	

}
