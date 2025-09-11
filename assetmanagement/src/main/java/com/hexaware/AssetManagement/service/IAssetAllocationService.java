package com.hexaware.AssetManagement.service;

import java.util.List;

import com.hexaware.AssetManagement.dto.AssetAllocationResponseDto;
import com.hexaware.AssetManagement.dto.AssetRequestDto;

public interface IAssetAllocationService {
	public AssetAllocationResponseDto requestAsset(AssetRequestDto requestDto);

	public List<AssetAllocationResponseDto> getEmployeeAllocations(Long employeeId);

	public List<AssetAllocationResponseDto> getAllAllocations();

	public List<AssetAllocationResponseDto> getPendingAllocations();

	public AssetAllocationResponseDto approveAllocation(Long allocationId, String adminComments);

	public AssetAllocationResponseDto rejectAllocation(Long allocationId, String adminComments);

	public AssetAllocationResponseDto returnAsset(Long allocationId);

	public AssetAllocationResponseDto getAllocationById(Long allocationId);
}