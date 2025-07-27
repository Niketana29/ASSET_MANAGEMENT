package com.hexaware.assetmanagement.pojo;

public class ServiceRequest {
	
    private int srid;
    private int eid; // Foreign Key: Employee
    private int aid; // Foreign Key: Asset
    private String description;
    private String issueType; // MALFUNCTION, REPAIR
    private String status;    // PENDING, IN_PROGRESS, COMPLETED
    
	public ServiceRequest() {
		super();
		// TODO Auto-generated constructor stub
	}

	public ServiceRequest(int srid, int eid, int aid, String description, String issueType, String status) {
		super();
		this.srid = srid;
		this.eid = eid;
		this.aid = aid;
		this.description = description;
		this.issueType = issueType;
		this.status = status;
	}

	public int getSrid() {
		return srid;
	}

	public void setSrid(int srid) {
		this.srid = srid;
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

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getIssueType() {
		return issueType;
	}

	public void setIssueType(String issueType) {
		this.issueType = issueType;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@Override
	public String toString() {
		return "ServiceRequest [srid=" + srid + ", eid=" + eid + ", aid=" + aid + ", description=" + description
				+ ", issueType=" + issueType + ", status=" + status + "]";
	}
    
    
}
