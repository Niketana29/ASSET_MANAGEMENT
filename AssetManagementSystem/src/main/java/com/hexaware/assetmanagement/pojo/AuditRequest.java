package com.hexaware.assetmanagement.pojo;

public class AuditRequest {
	
    private int arid;
    private int eid; // Foreign Key: Employee
    private int aid; // Foreign Key: Asset
    private String status; // PENDING, VERIFIED, REJECTED
    
	public AuditRequest() {
		super();
		// TODO Auto-generated constructor stub
	}

	public AuditRequest(int arid, int eid, int aid, String status) {
		super();
		this.arid = arid;
		this.eid = eid;
		this.aid = aid;
		this.status = status;
	}

	public int getArid() {
		return arid;
	}

	public void setArid(int arid) {
		this.arid = arid;
	}

	public int getEid() {
		return eid;
	}

	public void setEid(int eid) {
		this.eid = eid;
	}

	public int getAid() {
		return aid;
	}

	public void setAid(int aid) {
		this.aid = aid;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@Override
	public String toString() {
		return "AuditRequest [arid=" + arid + ", eid=" + eid + ", aid=" + aid + ", status=" + status + "]";
	}
    
    
}
