import api from "./api";

class AuditRequestService {
  async getAllAuditRequests() {
    const res = await api.get("/api/auditrequests/getall");
    return res.data;
  }

  async getAuditRequestById(arid) {
    const res = await api.get(`/api/auditrequests/getbyid/${arid}`);
    return res.data;
  }

  async createAuditRequest(request) {
    const res = await api.post("/api/auditrequests/insert", {
      eid: request.eid,
      aid: request.aid,
      status: request.status
    });
    return res.data;
  }

  async updateAuditRequest(request) {
    const res = await api.put("/api/auditrequests/update", {
      arid: request.arid,
      eid: request.eid,
      aid: request.aid,
      status: request.status
    });
    return res.data;
  }

  async deleteAuditRequest(arid) {
    const res = await api.delete(`/api/auditrequests/deletebyid/${arid}`);
    return res.data;
  }
}

export default new AuditRequestService();
