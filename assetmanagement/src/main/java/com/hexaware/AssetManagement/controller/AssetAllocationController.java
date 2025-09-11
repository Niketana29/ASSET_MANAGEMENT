package com.hexaware.AssetManagement.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hexaware.AssetManagement.dto.AssetAllocationResponseDto;
import com.hexaware.AssetManagement.dto.AssetRequestDto;
import com.hexaware.AssetManagement.service.IAssetAllocationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/allocations")
@CrossOrigin(origins = "*")
public class AssetAllocationController {

	@Autowired
	private IAssetAllocationService allocationService;

	@PostMapping("/request")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<AssetAllocationResponseDto> requestAsset(@Valid @RequestBody AssetRequestDto requestDto) {
		AssetAllocationResponseDto response = allocationService.requestAsset(requestDto);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/my/{employeeId}")
	@PreAuthorize("hasRole('USER') and @employeeService.getEmployeeById(#employeeId).email == authentication.name")
	public ResponseEntity<List<AssetAllocationResponseDto>> getMyAllocations(@PathVariable Long employeeId) {
		List<AssetAllocationResponseDto> allocations = allocationService.getEmployeeAllocations(employeeId);
		return ResponseEntity.ok(allocations);
	}

	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<AssetAllocationResponseDto>> getAllAllocations() {
		List<AssetAllocationResponseDto> allocations = allocationService.getAllAllocations();
		return ResponseEntity.ok(allocations);
	}

	@GetMapping("/pending")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<AssetAllocationResponseDto>> getPendingAllocations() {
		List<AssetAllocationResponseDto> allocations = allocationService.getPendingAllocations();
		return ResponseEntity.ok(allocations);
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
	public ResponseEntity<AssetAllocationResponseDto> getAllocationById(@PathVariable Long id) {
		AssetAllocationResponseDto allocation = allocationService.getAllocationById(id);
		return ResponseEntity.ok(allocation);
	}

	@PutMapping("/{id}/approve")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<AssetAllocationResponseDto> approveAllocation(@PathVariable Long id,
			@RequestBody Map<String, String> request) {
		String comments = request.getOrDefault("adminComments", "");
		AssetAllocationResponseDto allocation = allocationService.approveAllocation(id, comments);
		return ResponseEntity.ok(allocation);
	}

	@PutMapping("/{id}/reject")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<AssetAllocationResponseDto> rejectAllocation(@PathVariable Long id,
			@RequestBody Map<String, String> request) {
		String comments = request.getOrDefault("adminComments", "");
		AssetAllocationResponseDto allocation = allocationService.rejectAllocation(id, comments);
		return ResponseEntity.ok(allocation);
	}

	@PutMapping("/{id}/return")
	@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
	public ResponseEntity<AssetAllocationResponseDto> returnAsset(@PathVariable Long id) {
		AssetAllocationResponseDto allocation = allocationService.returnAsset(id);
		return ResponseEntity.ok(allocation);
	}
}