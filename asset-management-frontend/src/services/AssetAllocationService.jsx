import api from "./api";

class AssetAllocationService {
  getAllAllocations() {
    return api.get("/api/allocations/getall").then(res => res.data);
  }

  getAllocationById(allocId) {
    return api.get(`/api/allocations/getbyid/${allocId}`).then(res => res.data);
  }

  allocateAsset(data) {
    return api.post("/api/allocations/insert", {
      eid: data.eid,
      aid: data.aid,
      allocationDate: data.allocationDate,
      returnDate: data.returnDate,
    }).then(res => res.data);
  }

  updateAllocation(allocation) {
    return api.put("/api/allocations/update", allocation).then(res => res.data);
  }

  deleteAllocation(allocId) {
    return api.delete(`/api/allocations/deletebyid/${allocId}`).then(res => res.data);
  }
}

export default new AssetAllocationService();
