package com.hexaware.assetapi.service;

import java.util.List;

import com.hexaware.assetapi.dto.AssetDto;
import com.hexaware.assetapi.entity.Asset;

public interface IAssetService {
	
	public Asset addAsset(AssetDto assetDto);
    public AssetDto getById(int assetId);
    public List<Asset> getAllAssets();
    public Asset updateAsset(AssetDto assetDto);

}
