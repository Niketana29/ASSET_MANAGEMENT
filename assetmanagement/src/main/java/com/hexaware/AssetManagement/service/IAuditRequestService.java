package com.hexaware.AssetManagement.service;

import java.util.List;

import com.hexaware.AssetManagement.dto.AuditRequestDto;

public interface IAuditRequestService {
	public AuditRequestDto createAuditRequest(Long employeeId, Long assetId);

	public List<AuditRequestDto> createAuditRequestsForAllEmployees();

	public AuditRequestDto getAuditRequestById(Long auditId);

	public List<AuditRequestDto> getEmployeeAuditRequests(Long employeeId);

	public List<AuditRequestDto> getAllAuditRequests();

	public List<AuditRequestDto> getPendingAuditRequests();

	public AuditRequestDto verifyAuditRequest(Long auditId, String employeeComments);

	public AuditRequestDto rejectAuditRequest(Long auditId, String employeeComments);

	public void deleteAuditRequest(Long auditId);
}
