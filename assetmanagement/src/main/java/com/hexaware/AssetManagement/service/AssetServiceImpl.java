package com.hexaware.AssetManagement.service;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hexaware.AssetManagement.dto.AssetDto;
import com.hexaware.AssetManagement.entities.Asset;
import com.hexaware.AssetManagement.entities.Category;
import com.hexaware.AssetManagement.exception.BusinessException;
import com.hexaware.AssetManagement.exception.ResourceNotFoundException;
import com.hexaware.AssetManagement.repository.AssetRepository;
import com.hexaware.AssetManagement.repository.CategoryRepository;

@Service
@Transactional
public class AssetServiceImpl implements IAssetService {

	private static final Logger logger = LoggerFactory.getLogger(AssetServiceImpl.class);

	@Autowired
	private AssetRepository assetRepository;

	@Autowired
	private CategoryRepository categoryRepository;

	@Override
	public AssetDto createAsset(AssetDto assetDto) {
		logger.info("Creating asset: {}", assetDto.getAssetName());

		if (assetRepository.existsByAssetNo(assetDto.getAssetNo())) {
			throw new BusinessException("Asset with number already exists: " + assetDto.getAssetNo());
		}

		Category category = categoryRepository.findById(assetDto.getCategoryId())
				.orElseThrow(() -> new ResourceNotFoundException("Category", "id", assetDto.getCategoryId()));

		Asset asset = convertToEntity(assetDto, category);
		Asset savedAsset = assetRepository.save(asset);

		logger.info("Asset created successfully with ID: {}", savedAsset.getAssetId());
		return convertToDto(savedAsset);
	}

	@Override
	public AssetDto getAssetById(Long assetId) {
		Asset asset = assetRepository.findById(assetId)
				.orElseThrow(() -> new ResourceNotFoundException("Asset", "id", assetId));
		return convertToDto(asset);
	}

	@Override
	public AssetDto getAssetByAssetNo(String assetNo) {
		Asset asset = assetRepository.findByAssetNo(assetNo)
				.orElseThrow(() -> new ResourceNotFoundException("Asset", "assetNo", assetNo));
		return convertToDto(asset);
	}

	@Override
	public List<AssetDto> getAllAssets() {
		return assetRepository.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
	}

	@Override
	public List<AssetDto> getAvailableAssets() {
		return assetRepository.findByStatus(Asset.AssetStatus.AVAILABLE).stream().map(this::convertToDto)
				.collect(Collectors.toList());
	}

	@Override
	public List<AssetDto> getAssetsByCategory(Long categoryId) {
		return assetRepository.findByCategoryId(categoryId).stream().map(this::convertToDto)
				.collect(Collectors.toList());
	}

	@Override
	public List<AssetDto> searchAssetsByName(String assetName) {
		return assetRepository.findByAssetNameContainingIgnoreCase(assetName).stream().map(this::convertToDto)
				.collect(Collectors.toList());
	}

	@Override
	public AssetDto updateAsset(Long assetId, AssetDto assetDto) {
		logger.info("Updating asset with ID: {}", assetId);

		Asset existingAsset = assetRepository.findById(assetId)
				.orElseThrow(() -> new ResourceNotFoundException("Asset", "id", assetId));

		// Check if asset number is being changed and if new number already exists
		if (!existingAsset.getAssetNo().equals(assetDto.getAssetNo())
				&& assetRepository.existsByAssetNo(assetDto.getAssetNo())) {
			throw new BusinessException("Asset with number already exists: " + assetDto.getAssetNo());
		}

		Category category = categoryRepository.findById(assetDto.getCategoryId())
				.orElseThrow(() -> new ResourceNotFoundException("Category", "id", assetDto.getCategoryId()));

		existingAsset.setAssetNo(assetDto.getAssetNo());
		existingAsset.setAssetName(assetDto.getAssetName());
		existingAsset.setCategory(category);
		existingAsset.setAssetModel(assetDto.getAssetModel());
		existingAsset.setManufacturingDate(assetDto.getManufacturingDate());
		existingAsset.setExpiryDate(assetDto.getExpiryDate());
		existingAsset.setAssetValue(assetDto.getAssetValue());
		existingAsset.setDescription(assetDto.getDescription());

		if (assetDto.getStatus() != null) {
			existingAsset.setStatus(Asset.AssetStatus.valueOf(assetDto.getStatus()));
		}

		Asset updatedAsset = assetRepository.save(existingAsset);

		logger.info("Asset updated successfully: {}", assetId);
		return convertToDto(updatedAsset);
	}

	@Override
	public void deleteAsset(Long assetId) {
		logger.info("Deleting asset with ID: {}", assetId);

		if (!assetRepository.existsById(assetId)) {
			throw new ResourceNotFoundException("Asset", "id", assetId);
		}

		assetRepository.deleteById(assetId);
		logger.info("Asset deleted successfully: {}", assetId);
	}

	private AssetDto convertToDto(Asset asset) {
		AssetDto dto = new AssetDto();
		dto.setAssetId(asset.getAssetId());
		dto.setAssetNo(asset.getAssetNo());
		dto.setAssetName(asset.getAssetName());
		dto.setCategoryId(asset.getCategory().getCategoryId());
		dto.setCategoryName(asset.getCategory().getCategoryName());
		dto.setIsAutoApproved(asset.getCategory().getIsAutoApproved());
		dto.setAssetModel(asset.getAssetModel());
		dto.setManufacturingDate(asset.getManufacturingDate());
		dto.setExpiryDate(asset.getExpiryDate());
		dto.setAssetValue(asset.getAssetValue());
		dto.setStatus(asset.getStatus().toString());
		dto.setDescription(asset.getDescription());
		return dto;
	}

	private Asset convertToEntity(AssetDto dto, Category category) {
		Asset asset = new Asset();
		asset.setAssetNo(dto.getAssetNo());
		asset.setAssetName(dto.getAssetName());
		asset.setCategory(category);
		asset.setAssetModel(dto.getAssetModel());
		asset.setManufacturingDate(dto.getManufacturingDate());
		asset.setExpiryDate(dto.getExpiryDate());
		asset.setAssetValue(dto.getAssetValue());
		asset.setDescription(dto.getDescription());

		if (dto.getStatus() != null) {
			asset.setStatus(Asset.AssetStatus.valueOf(dto.getStatus()));
		} else {
			asset.setStatus(Asset.AssetStatus.AVAILABLE);
		}

		return asset;
	}
}