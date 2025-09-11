import api from './api';

class AssetService {
  async getAllAssets() {
    try {
      const response = await api.get('/assets');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch assets' };
    }
  }

  async getAvailableAssets() {
    try {
      const response = await api.get('/assets/browse');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch available assets' };
    }
  }

  async getAssetById(id) {
    try {
      const response = await api.get(`/assets/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch asset details' };
    }
  }

  async searchAssets(name) {
    try {
      const response = await api.get(`/assets/search?name=${encodeURIComponent(name)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to search assets' };
    }
  }

  async createAsset(assetData) {
    try {
      const response = await api.post('/assets', assetData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create asset' };
    }
  }

  async updateAsset(id, assetData) {
    try {
      const response = await api.put(`/assets/${id}`, assetData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update asset' };
    }
  }

  async deleteAsset(id) {
    try {
      const response = await api.delete(`/assets/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete asset' };
    }
  }

  async getAssetsByCategory(categoryId) {
    try {
      const response = await api.get(`/assets/category/${categoryId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch assets by category' };
    }
  }
}

export default new AssetService();
