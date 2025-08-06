package com.hexaware.assetManagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.assetManagement.entities.Asset;
import com.hexaware.assetManagement.repository.AssetRepository;


@Service
public class AssetServiceImpl implements IAssetService {

	
	@Autowired
	AssetRepository assetRepo;
	
	@Override
	public Asset addAsset(Asset asset) {
		// TODO Auto-generated method stub
		return assetRepo.save(asset);
	}

	@Override
	public Asset updateAsset(Asset asset) {
		// TODO Auto-generated method stub
		return assetRepo.save(asset);
	}

	@Override
	public Asset getAssetById(int aid) {
		// TODO Auto-generated method stub
		return assetRepo.findById(aid).orElse(null);
	}

	@Override
	public String deleteAssetById(int aid) {
		// TODO Auto-generated method stub
		assetRepo.deleteById(aid);
		return "Asset Deleted successfully";
	}

	@Override
	public List<Asset> getAllAssets() {
		// TODO Auto-generated method stub
		return assetRepo.findAll();
	}

}
