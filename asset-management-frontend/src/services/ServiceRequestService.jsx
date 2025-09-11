import api from './api';

class ServiceRequestService {
  async createServiceRequest(requestData) {
    try {
      const response = await api.post('/service-requests', requestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create service request' };
    }
  }

  async getMyServiceRequests(employeeId) {
    try {
      const response = await api.get(`/service-requests/my/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch my service requests' };
    }
  }

  async getAllServiceRequests() {
    try {
      const response = await api.get('/service-requests');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch all service requests' };
    }
  }

  async getPendingServiceRequests() {
    try {
      const response = await api.get('/service-requests/pending');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch pending service requests' };
    }
  }

  async updateServiceRequestStatus(requestId, status, comments) {
    try {
      const response = await api.put(`/service-requests/${requestId}/status`, {
        status,
        adminComments: comments
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update service request status' };
    }
  }

  async deleteServiceRequest(requestId) {
    try {
      const response = await api.delete(`/service-requests/${requestId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete service request' };
    }
  }
}

export default new ServiceRequestService();
