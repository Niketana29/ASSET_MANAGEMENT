import api from "./api";

class ServiceRequestService {
  async getAllServiceRequests() {
    const res = await api.get("/api/servicerequests/getall");
    return res.data;
  }

  async getServiceRequestById(srid) {
    const res = await api.get(`/api/servicerequests/getbyid/${srid}`);
    return res.data;
  }

  async createServiceRequest(data) {
    const res = await api.post("/api/servicerequests/insert", {
      eid: data.eid,       
      aid: data.aid,        
      description: data.description,
      issueType: data.issueType,
      status: data.status
    });
    return res.data;
  }

  async updateServiceRequest(request) {
    const res = await api.put("/api/servicerequests/update", {
      srid: request.srid,
      eid: request.eid,        
      aid: request.aid,        
      description: request.description,
      issueType: request.issueType,
      status: request.status,
    });
    return res.data;
  }

  async deleteServiceRequest(srid) {
    const res = await api.delete(`/api/servicerequests/deletebyid/${srid}`);
    return res.data;
  }
}

export default new ServiceRequestService();
