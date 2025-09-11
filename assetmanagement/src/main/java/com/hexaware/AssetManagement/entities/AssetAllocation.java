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
@Table(name = "asset_allocations")
public class AssetAllocation {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long allocationId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "employee_id", nullable = false)
	private Employee employee;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "asset_id", nullable = false)
	private Asset asset;

	@Column(name = "allocated_date")
	private LocalDateTime allocatedDate;

	@Column(name = "return_date")
	private LocalDateTime returnDate;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private AllocationStatus status = AllocationStatus.REQUESTED;

	@Column(name = "request_reason")
	private String requestReason;

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
		if (allocatedDate == null && status == AllocationStatus.APPROVED) {
			allocatedDate = LocalDateTime.now();
		}
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
		if (allocatedDate == null && status == AllocationStatus.APPROVED) {
			allocatedDate = LocalDateTime.now();
		}
		if (returnDate == null && status == AllocationStatus.RETURNED) {
			returnDate = LocalDateTime.now();
		}
	}

	public enum AllocationStatus {
		REQUESTED, APPROVED, REJECTED, RETURNED

	}

	public AssetAllocation() {
		super();
		// TODO Auto-generated constructor stub
	}

	public AssetAllocation(Long allocationId, Employee employee, Asset asset, LocalDateTime allocatedDate,
			LocalDateTime returnDate, AllocationStatus status, String requestReason, String adminComments,
			LocalDateTime createdAt, LocalDateTime updatedAt) {
		super();
		this.allocationId = allocationId;
		this.employee = employee;
		this.asset = asset;
		this.allocatedDate = allocatedDate;
		this.returnDate = returnDate;
		this.status = status;
		this.requestReason = requestReason;
		this.adminComments = adminComments;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public Long getAllocationId() {
		return allocationId;
	}

	public void setAllocationId(Long allocationId) {
		this.allocationId = allocationId;
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

	public LocalDateTime getAllocatedDate() {
		return allocatedDate;
	}

	public void setAllocatedDate(LocalDateTime allocatedDate) {
		this.allocatedDate = allocatedDate;
	}

	public LocalDateTime getReturnDate() {
		return returnDate;
	}

	public void setReturnDate(LocalDateTime returnDate) {
		this.returnDate = returnDate;
	}

	public AllocationStatus getStatus() {
		return status;
	}

	public void setStatus(AllocationStatus status) {
		this.status = status;
	}

	public String getRequestReason() {
		return requestReason;
	}

	public void setRequestReason(String requestReason) {
		this.requestReason = requestReason;
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
		return "AssetAllocation [allocationId=" + allocationId + ", employee=" + employee + ", asset=" + asset
				+ ", allocatedDate=" + allocatedDate + ", returnDate=" + returnDate + ", status=" + status
				+ ", requestReason=" + requestReason + ", adminComments=" + adminComments + ", createdAt=" + createdAt
				+ ", updatedAt=" + updatedAt + "]";
	}

}