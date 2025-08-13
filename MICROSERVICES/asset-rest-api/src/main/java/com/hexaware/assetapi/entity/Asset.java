package com.hexaware.assetapi.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "asset_info")
public class Asset {
	
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int assetId;
    private String assetName;
    private String assetType;
    
	public Asset() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Asset(int assetId, String assetName, String assetType) {
		super();
		this.assetId = assetId;
		this.assetName = assetName;
		this.assetType = assetType;
	}

	public int getAssetId() {
		return assetId;
	}

	public void setAssetId(int assetId) {
		this.assetId = assetId;
	}

	public String getAssetName() {
		return assetName;
	}

	public void setAssetName(String assetName) {
		this.assetName = assetName;
	}

	public String getAssetType() {
		return assetType;
	}

	public void setAssetType(String assetType) {
		this.assetType = assetType;
	}

	@Override
	public String toString() {
		return "Asset [assetId=" + assetId + ", assetName=" + assetName + ", assetType=" + assetType + "]";
	}
    
    

}
