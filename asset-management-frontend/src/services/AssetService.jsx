import api from "./api";

class AssetService {
  getAllAssets() {
    return api.get("/api/assets/getall").then(res => res.data);
  }

  getAssetById(aid) {
    return api.get(`/api/assets/getbyid/${aid}`).then(res => res.data);
  }

  addAsset(asset) {
    return api.post("/api/assets/insert", asset).then(res => res.data);
  }

  updateAsset(asset) {
    return api.put("/api/assets/update", asset).then(res => res.data);
  }

  deleteAsset(aid) {
    return api.delete(`/api/assets/deletebyid/${aid}`).then(res => res.data);
  }
}

export default new AssetService();
