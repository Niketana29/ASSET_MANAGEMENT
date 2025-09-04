import api from "./api";

class AssetAllocationService {
  async getAllAllocations() {
    const res = await api.get("/api/allocations/getall");
    return res.data;
  }

  async getAllocationById(allocId) {
    const res = await api.get(`/api/allocations/getbyid/${allocId}`);
    return res.data;
  }

  async allocateAsset(data) {
    const res = await api.post("/api/allocations/insert", {
      eid: data.eid,          
      aid: data.aid,
      allocationDate: data.allocationDate,
      returnDate: data.returnDate,

    });
    return res.data;
  }

  async updateAllocation(allocation) {
    const res = await api.put("/api/allocations/update", {
      allocId: allocation.allocId,
      eid: allocation.eid,
      aid: allocation.aid,
      allocationDate: allocation.allocationDate,
      returnDate: allocation.returnDate,
      status: allocation.status
    });
    return res.data;
  }

  async deleteAllocation(allocId) {
    const res = await api.delete(`/api/allocations/deletebyid/${allocId}`);
    return res.data;
  }

  async approveAllocation(allocId) {
    const res = await api.put(`/api/allocations/approve/${allocId}`);
    return res.data;
  }

  async rejectAllocation(allocId) {
    const res = await api.put(`/api/allocations/reject/${allocId}`);
    return res.data;
  }
}

export default new AssetAllocationService();
