package com.hexaware.AssetManagement.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "service_requests")
public class ServiceRequest {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long requestId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "employee_id", nullable = false)
	private Employee employee;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "asset_id", nullable = false)
	private Asset asset;

	@Column(name = "asset_no", nullable = false)
	private String assetNo;

	@Column(nullable = false, length = 1000)
	private String description;

	@Enumerated(EnumType.STRING)
	@Column(name = "issue_type", nullable = false)
	private IssueType issueType;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ServiceStatus status = ServiceStatus.PENDING;

	@Column(name = "admin_comments")
	private String adminComments;

	@Column(name = "created_at")
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
		updatedAt = LocalDateTime.now();
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
	}

	public enum IssueType {
		MALFUNCTION, REPAIR, MAINTENANCE, OTHER
	}

	public enum ServiceStatus {
		PENDING, IN_PROGRESS, COMPLETED, REJECTED
	}

	public ServiceRequest() {
		super();
		// TODO Auto-generated constructor stub
	}

	public ServiceRequest(Long requestId, Employee employee, Asset asset, String assetNo, String description,
			IssueType issueType, ServiceStatus status, String adminComments, LocalDateTime createdAt,
			LocalDateTime updatedAt) {
		super();
		this.requestId = requestId;
		this.employee = employee;
		this.asset = asset;
		this.assetNo = assetNo;
		this.description = description;
		this.issueType = issueType;
		this.status = status;
		this.adminComments = adminComments;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public Long getRequestId() {
		return requestId;
	}

	public void setRequestId(Long requestId) {
		this.requestId = requestId;
	}

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}

	public Asset getAsset() {
		return asset;
	}

	public void setAsset(Asset asset) {
		this.asset = asset;
	}

	public String getAssetNo() {
		return assetNo;
	}

	public void setAssetNo(String assetNo) {
		this.assetNo = assetNo;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public IssueType getIssueType() {
		return issueType;
	}

	public void setIssueType(IssueType issueType) {
		this.issueType = issueType;
	}

	public ServiceStatus getStatus() {
		return status;
	}

	public void setStatus(ServiceStatus status) {
		this.status = status;
	}

	public String getAdminComments() {
		return adminComments;
	}

	public void setAdminComments(String adminComments) {
		this.adminComments = adminComments;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	@Override
	public String toString() {
		return "ServiceRequest [requestId=" + requestId + ", employee=" + employee + ", asset=" + asset + ", assetNo="
				+ assetNo + ", description=" + description + ", issueType=" + issueType + ", status=" + status
				+ ", adminComments=" + adminComments + ", createdAt=" + createdAt + ", updatedAt=" + updatedAt + "]";
	}

}