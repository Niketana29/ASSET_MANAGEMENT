import api from "./api";

class ServiceRequestService {
  getAllServiceRequests() {
    return api.get("/api/servicerequests/getall").then(res => res.data);
  }

  getServiceRequestById(srid) {
    return api.get(`/api/servicerequests/getbyid/${srid}`).then(res => res.data);
  }

  createServiceRequest(data) {
    return api.post("/api/servicerequests/insert", {
      eid: data.eid,
      aid: data.aid,
      description: data.description,
      issueType: data.issueType, // MALFUNCTION or REPAIR
      status: data.status, // PENDING, IN_PROGRESS, COMPLETED
    }).then(res => res.data);
  }

  updateServiceRequest(request) {
    return api.put("/api/servicerequests/update", request).then(res => res.data);
  }

  deleteServiceRequest(srid) {
    return api.delete(`/api/servicerequests/deletebyid/${srid}`).then(res => res.data);
  }
}

export default new ServiceRequestService();
