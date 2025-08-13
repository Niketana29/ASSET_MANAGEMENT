package com.hexaware.assetapi.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hexaware.assetapi.dto.AssetDto;
import com.hexaware.assetapi.entity.Asset;
import com.hexaware.assetapi.exception.AssetNotFoundException;
import com.hexaware.assetapi.service.IAssetService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;

@RestController
@RequestMapping("/api/assets")
public class AssetRestController {

    Logger logger = LoggerFactory.getLogger(AssetRestController.class);

    @Autowired
    IAssetService service;

    @PostMapping("/add")
    public Asset addAsset(@RequestBody AssetDto dto) {
        return service.addAsset(dto);
    }

    @PutMapping("/update")
    public Asset updateAsset(@RequestBody AssetDto dto) {
        return service.updateAsset(dto);
    }

    @GetMapping("/get/{id}")
    public AssetDto getById(@PathVariable @Valid @Min(1) int id) throws AssetNotFoundException {
        AssetDto dto = service.getById(id);
        if (dto.getAssetId() == 0) {
            throw new AssetNotFoundException(HttpStatus.BAD_REQUEST, "Asset Not Found for Id : " + id);
        }
        return dto;
    }

    @GetMapping("/getall")
    public List<Asset> getAllAssets() {
        logger.info("Fetching all assets from controller");
        return service.getAllAssets();
    }
}
