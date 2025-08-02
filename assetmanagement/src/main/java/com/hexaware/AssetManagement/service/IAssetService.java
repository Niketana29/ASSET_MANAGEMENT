package com.hexaware.AssetManagement.service;

import java.util.List;

import com.hexaware.AssetManagement.entities.Asset;

public interface IAssetService {
	
    public Asset addAsset(Asset asset);
    public Asset updateAsset(Asset asset);
    
    public Asset getAssetById(int aid);
    public String deleteAssetById(int aid);
    
    public List<Asset> getAllAssets();

}
