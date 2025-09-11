package com.hexaware.AssetManagement.service;

import java.util.List;

import com.hexaware.AssetManagement.dto.AssetDto;

public interface IAssetService {
	public AssetDto createAsset(AssetDto assetDto);

	public AssetDto getAssetById(Long assetId);

	public AssetDto getAssetByAssetNo(String assetNo);

	public List<AssetDto> getAllAssets();

	public List<AssetDto> getAvailableAssets();

	public List<AssetDto> getAssetsByCategory(Long categoryId);

	public List<AssetDto> searchAssetsByName(String assetName);

	public AssetDto updateAsset(Long assetId, AssetDto assetDto);

	public void deleteAsset(Long assetId);
}