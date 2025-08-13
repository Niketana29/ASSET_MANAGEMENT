package com.hexaware.assetapi.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.assetapi.dto.AssetDto;
import com.hexaware.assetapi.entity.Asset;
import com.hexaware.assetapi.repository.AssetRepository;


@Service
public class AssetServiceImp implements IAssetService {

	
	@Autowired
	AssetRepository repo;
	
    Logger logger = LoggerFactory.getLogger(AssetServiceImp.class);

    @Override
    public Asset addAsset(AssetDto dto) {
        Asset asset = new Asset();
        asset.setAssetName(dto.getAssetName());
        asset.setAssetType(dto.getAssetType());
        return repo.save(asset);
    }

    @Override
    public Asset updateAsset(AssetDto dto) {
        Asset asset = new Asset();
        asset.setAssetId(dto.getAssetId());
        asset.setAssetName(dto.getAssetName());
        asset.setAssetType(dto.getAssetType());
        return repo.save(asset);
    }

    @Override
    public AssetDto getById(int assetId) {
        Asset asset = repo.findById(assetId).orElse(new Asset());
        AssetDto dto = new AssetDto();
        dto.setAssetId(asset.getAssetId());
        dto.setAssetName(asset.getAssetName());
        dto.setAssetType(asset.getAssetType());
        return dto;
    }

    @Override
    public List<Asset> getAllAssets() {
        logger.info("Fetching all assets");
        return repo.findAll();
    }

}
