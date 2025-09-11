import api from './api';

class AssetAllocationService {
  async requestAsset(requestData) {
    try {
      const response = await api.post('/allocations/request', requestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to request asset' };
    }
  }

  async getMyAllocations(employeeId) {
    try {
      const response = await api.get(`/allocations/my/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch my allocations' };
    }
  }

  async getAllAllocations() {
    try {
      const response = await api.get('/allocations');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch all allocations' };
    }
  }

  async getPendingAllocations() {
    try {
      const response = await api.get('/allocations/pending');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch pending allocations' };
    }
  }

  async approveAllocation(allocationId, comments) {
    try {
      const response = await api.put(`/allocations/${allocationId}/approve`, {
        adminComments: comments
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to approve allocation' };
    }
  }

  async rejectAllocation(allocationId, comments) {
    try {
      const response = await api.put(`/allocations/${allocationId}/reject`, {
        adminComments: comments
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reject allocation' };
    }
  }

  async returnAsset(allocationId) {
    try {
      const response = await api.put(`/allocations/${allocationId}/return`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to return asset' };
    }
  }

  async getAllocationById(allocationId) {
    try {
      const response = await api.get(`/allocations/${allocationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch allocation details' };
    }
  }
}

export default new AssetAllocationService();
