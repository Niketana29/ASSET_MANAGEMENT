import api from "./api";

class AssetService {
  async getAllAssets() {
    const res = await api.get("/api/assets/getall");
    return res.data;
  }

  async getAssetById(aid) {
    const res = await api.get(`/api/assets/getbyid/${aid}`);
    return res.data;
  }

  async addAsset(asset) {
    const res = await api.post("/api/assets/insert", {
      assetNo: asset.assetNo,
      aname: asset.aname,
      categoryId: asset.categoryId,       
      model: asset.model,
      manufacturingDate: asset.manufacturingDate,
      expiryDate: asset.expiryDate,
      assetValue: asset.assetValue,
      status: asset.status
    });
    return res.data;
  }

  async updateAsset(asset) {
    const res = await api.put("/api/assets/update", {
      aid: asset.aid,
      assetNo: asset.assetNo,
      aname: asset.aname,
      categoryId: asset.categoryId,       
      model: asset.model,
      manufacturingDate: asset.manufacturingDate,
      expiryDate: asset.expiryDate,
      assetValue: asset.assetValue,
      status: asset.status
    });
    return res.data;
  }

  async deleteAsset(aid) {
    const res = await api.delete(`/api/assets/deletebyid/${aid}`);
    return res.data;
  }


  async getAssetsByName(name){
    const res = await api.get(`api/assets/getbyname/${name}`);
    return res.data;
  }
}

export default new AssetService();
