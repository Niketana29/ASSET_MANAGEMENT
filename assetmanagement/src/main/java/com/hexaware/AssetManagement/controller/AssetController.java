package com.hexaware.AssetManagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hexaware.AssetManagement.dto.AssetDto;
import com.hexaware.AssetManagement.service.IAssetService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = "*")
public class AssetController {

	@Autowired
	private IAssetService assetService;

	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<AssetDto>> getAllAssets() {
		List<AssetDto> assets = assetService.getAllAssets();
		return ResponseEntity.ok(assets);
	}

	@GetMapping("/browse")
	@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
	public ResponseEntity<List<AssetDto>> getAvailableAssets() {
		List<AssetDto> assets = assetService.getAvailableAssets();
		return ResponseEntity.ok(assets);
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
	public ResponseEntity<AssetDto> getAssetById(@PathVariable Long id) {
		AssetDto asset = assetService.getAssetById(id);
		return ResponseEntity.ok(asset);
	}

	@GetMapping("/asset-no/{assetNo}")
	public ResponseEntity<AssetDto> getAssetByAssetNo(@PathVariable String assetNo) {
		AssetDto asset = assetService.getAssetByAssetNo(assetNo);
		return ResponseEntity.ok(asset);
	}

	@GetMapping("/category/{categoryId}")
	public ResponseEntity<List<AssetDto>> getAssetsByCategory(@PathVariable Long categoryId) {
		List<AssetDto> assets = assetService.getAssetsByCategory(categoryId);
		return ResponseEntity.ok(assets);
	}

	@GetMapping("/search")
	public ResponseEntity<List<AssetDto>> searchAssetsByName(@RequestParam String name) {
		List<AssetDto> assets = assetService.searchAssetsByName(name);
		return ResponseEntity.ok(assets);
	}

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<AssetDto> createAsset(@Valid @RequestBody AssetDto assetDto) {
		AssetDto createdAsset = assetService.createAsset(assetDto);
		return ResponseEntity.ok(createdAsset);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<AssetDto> updateAsset(@PathVariable Long id, @Valid @RequestBody AssetDto assetDto) {
		AssetDto updatedAsset = assetService.updateAsset(id, assetDto);
		return ResponseEntity.ok(updatedAsset);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Void> deleteAsset(@PathVariable Long id) {
		assetService.deleteAsset(id);
		return ResponseEntity.ok().build();
	}
}