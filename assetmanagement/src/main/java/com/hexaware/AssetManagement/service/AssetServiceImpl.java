package com.hexaware.assetManagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.assetManagement.entities.Asset;
import com.hexaware.assetManagement.repository.AssetRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AssetServiceImpl implements IAssetService {

	
	@Autowired
	AssetRepository assetRepo;
	
	@Override
	public Asset addAsset(Asset asset) {
		// TODO Auto-generated method stub
        log.info("Service - addAsset() called with: {}", asset);
		return assetRepo.save(asset);
	}

	@Override
	public Asset updateAsset(Asset asset) {
		// TODO Auto-generated method stub
        log.info("Service - updateAsset() called with: {}", asset);
		return assetRepo.save(asset);
	}

	@Override
	public Asset getAssetById(int aid) {
		// TODO Auto-generated method stub
        log.debug("Service - getAssetById() called with ID: {}", aid);
		return assetRepo.findById(aid).orElse(null);
	}

	@Override
	public String deleteAssetById(int aid) {
		// TODO Auto-generated method stub
        log.warn("Service - deleteAssetById() called with ID: {}", aid);
		assetRepo.deleteById(aid);
		return "Asset Deleted successfully";
	}

	@Override
	public List<Asset> getAllAssets() {
		// TODO Auto-generated method stub
        log.debug("Service - getAllAssets() called");
		return assetRepo.findAll();
	}

}
