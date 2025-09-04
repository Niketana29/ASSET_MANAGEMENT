import api from "./api";

class AuditRequestService {
  getAllAuditRequests() {
    return api.get("/api/auditrequests/getall").then(res => res.data);
  }

  getAuditRequestById(arid) {
    return api.get(`/api/auditrequests/getbyid/${arid}`).then(res => res.data);
  }

  createAuditRequest(request) {
    return api.post("/api/auditrequests/insert", request).then(res => res.data);
  }

  updateAuditRequest(request) {
    return api.put("/api/auditrequests/update", request).then(res => res.data);
  }

  deleteAuditRequest(arid) {
    return api.delete(`/api/auditrequests/deletebyid/${arid}`).then(res => res.data);
  }
}

export default new AuditRequestService();
