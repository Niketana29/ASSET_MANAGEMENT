package com.hexaware.AssetManagement.entities;

import java.math.BigDecimal;
import java.time.LocalDate;
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
@Table(name = "assets")
public class Asset {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long assetId;

	@Column(name = "asset_no", unique = true, nullable = false)
	private String assetNo;

	@Column(name = "asset_name", nullable = false)
	private String assetName;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "category_id", nullable = false)
	private Category category;

	@Column(name = "asset_model")
	private String assetModel;

	@Column(name = "manufacturing_date")
	private LocalDate manufacturingDate;

	@Column(name = "expiry_date")
	private LocalDate expiryDate;

	@Column(name = "asset_value")
	private BigDecimal assetValue;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private AssetStatus status = AssetStatus.AVAILABLE;

	private String description;

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

	public enum AssetStatus {
		AVAILABLE, ALLOCATED, MAINTENANCE, RETIRED
	}

	public Asset() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Asset(Long assetId, String assetNo, String assetName, Category category, String assetModel,
			LocalDate manufacturingDate, LocalDate expiryDate, BigDecimal assetValue, AssetStatus status,
			String description, LocalDateTime createdAt, LocalDateTime updatedAt) {
		super();
		this.assetId = assetId;
		this.assetNo = assetNo;
		this.assetName = assetName;
		this.category = category;
		this.assetModel = assetModel;
		this.manufacturingDate = manufacturingDate;
		this.expiryDate = expiryDate;
		this.assetValue = assetValue;
		this.status = status;
		this.description = description;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public Long getAssetId() {
		return assetId;
	}

	public void setAssetId(Long assetId) {
		this.assetId = assetId;
	}

	public String getAssetNo() {
		return assetNo;
	}

	public void setAssetNo(String assetNo) {
		this.assetNo = assetNo;
	}

	public String getAssetName() {
		return assetName;
	}

	public void setAssetName(String assetName) {
		this.assetName = assetName;
	}

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}

	public String getAssetModel() {
		return assetModel;
	}

	public void setAssetModel(String assetModel) {
		this.assetModel = assetModel;
	}

	public LocalDate getManufacturingDate() {
		return manufacturingDate;
	}

	public void setManufacturingDate(LocalDate manufacturingDate) {
		this.manufacturingDate = manufacturingDate;
	}

	public LocalDate getExpiryDate() {
		return expiryDate;
	}

	public void setExpiryDate(LocalDate expiryDate) {
		this.expiryDate = expiryDate;
	}

	public BigDecimal getAssetValue() {
		return assetValue;
	}

	public void setAssetValue(BigDecimal assetValue) {
		this.assetValue = assetValue;
	}

	public AssetStatus getStatus() {
		return status;
	}

	public void setStatus(AssetStatus status) {
		this.status = status;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
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
		return "Asset [assetId=" + assetId + ", assetNo=" + assetNo + ", assetName=" + assetName + ", category="
				+ category + ", assetModel=" + assetModel + ", manufacturingDate=" + manufacturingDate + ", expiryDate="
				+ expiryDate + ", assetValue=" + assetValue + ", status=" + status + ", description=" + description
				+ ", createdAt=" + createdAt + ", updatedAt=" + updatedAt + "]";
	}

}