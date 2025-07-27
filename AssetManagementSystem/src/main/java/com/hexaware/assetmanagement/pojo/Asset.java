package com.hexaware.assetmanagement.pojo;

import java.util.Date;

public class Asset {
	
    private int aid;
    private String assetNo;
    private String aname;
    private String category;
    private String model;
    private Date manufacturingDate;
    private Date expiryDate;
    private double assetValue;
    private String status; // AVAILABLE, ASSIGNED, UNDER_SERVICE
    
	public Asset() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Asset(int aid, String assetNo, String aname, String category, String model, Date manufacturingDate,
			Date expiryDate, double assetValue, String status) {
		super();
		this.aid = aid;
		this.assetNo = assetNo;
		this.aname = aname;
		this.category = category;
		this.model = model;
		this.manufacturingDate = manufacturingDate;
		this.expiryDate = expiryDate;
		this.assetValue = assetValue;
		this.status = status;
	}

	public int getAid() {
		return aid;
	}

	public void setAid(int aid) {
		this.aid = aid;
	}

	public String getAssetNo() {
		return assetNo;
	}

	public void setAssetNo(String assetNo) {
		this.assetNo = assetNo;
	}

	public String getAname() {
		return aname;
	}

	public void setAname(String aname) {
		this.aname = aname;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getModel() {
		return model;
	}

	public void setModel(String model) {
		this.model = model;
	}

	public Date getManufacturingDate() {
		return manufacturingDate;
	}

	public void setManufacturingDate(Date manufacturingDate) {
		this.manufacturingDate = manufacturingDate;
	}

	public Date getExpiryDate() {
		return expiryDate;
	}

	public void setExpiryDate(Date expiryDate) {
		this.expiryDate = expiryDate;
	}

	public double getAssetValue() {
		return assetValue;
	}

	public void setAssetValue(double assetValue) {
		this.assetValue = assetValue;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@Override
	public String toString() {
		return "Asset [aid=" + aid + ", assetNo=" + assetNo + ", aname=" + aname + ", category=" + category + ", model="
				+ model + ", manufacturingDate=" + manufacturingDate + ", expiryDate=" + expiryDate + ", assetValue="
				+ assetValue + ", status=" + status + "]";
	}
    
    
}

