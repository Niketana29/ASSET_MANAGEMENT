package com.hexaware.assetManagement.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.hexaware.assetManagement.entities.Asset;
import com.hexaware.assetManagement.exception.BusinessException;
import com.hexaware.assetManagement.exception.ResourceNotFoundException;
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
        if (asset.getAname() == null || asset.getAname().trim().isEmpty()) {
            throw new BusinessException("Asset name cannot be empty");
        }
        if (asset.getManufacturingDate() != null && asset.getExpiryDate() != null &&
            asset.getExpiryDate().before(asset.getManufacturingDate())) {
            throw new BusinessException("Expiry date cannot be before manufacturing date");
        }

        if (asset.getAssetValue() < 0) {
            throw new BusinessException("Asset value cannot be negative");
        }
		return assetRepo.save(asset);
	}

	@Override
	public Asset updateAsset(Asset asset) {
		// TODO Auto-generated method stub
        log.info("Service - updateAsset() called with: {}", asset);
        if (!assetRepo.existsById(asset.getAid())) {
            throw new ResourceNotFoundException(HttpStatus.NOT_FOUND, "Cannot update — Asset not found with ID: " + asset.getAid());
        }
        
        if (asset.getAname() == null || asset.getAname().trim().isEmpty()) {
            throw new BusinessException("Asset name cannot be empty");
        }
        if (asset.getAssetValue() < 0) {
            throw new BusinessException("Asset value cannot be negative");
        }
		return assetRepo.save(asset);
	}

	@Override
	public Asset getAssetById(int aid) {
		// TODO Auto-generated method stub
        log.debug("Service - getAssetById() called with ID: {}", aid);
		return assetRepo.findById(aid).orElseThrow(() -> new ResourceNotFoundException(HttpStatus.NOT_FOUND, "Asset not found with ID: " + aid));
	}

	@Override
	public String deleteAssetById(int aid) {
		// TODO Auto-generated method stub
        log.warn("Service - deleteAssetById() called with ID: {}", aid);
        if (!assetRepo.existsById(aid)) {
            throw new ResourceNotFoundException(HttpStatus.NOT_FOUND, "Cannot delete — Asset not found with ID: " + aid);
        }
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
