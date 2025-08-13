package com.hexaware.employeeapi.dto;

public class Asset {
	
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
    
    

}
