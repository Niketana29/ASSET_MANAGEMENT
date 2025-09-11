import api from './api';

class AuditRequestService {
  async createAuditRequestsForAll() {
    try {
      const response = await api.post('/audit-requests/create-all');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create audit requests' };
    }
  }

  async createAuditRequest(employeeId, assetId) {
    try {
      const response = await api.post(`/audit-requests?employeeId=${employeeId}&assetId=${assetId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create audit request' };
    }
  }

  async getMyAuditRequests(employeeId) {
    try {
      const response = await api.get(`/audit-requests/my/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch my audit requests' };
    }
  }

  async getAllAuditRequests() {
    try {
      const response = await api.get('/audit-requests');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch all audit requests' };
    }
  }

  async getPendingAuditRequests() {
    try {
      const response = await api.get('/audit-requests/pending');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch pending audit requests' };
    }
  }

  async verifyAuditRequest(auditId, comments) {
    try {
      const response = await api.put(`/audit-requests/${auditId}/verify`, {
        employeeComments: comments
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to verify audit request' };
    }
  }

  async rejectAuditRequest(auditId, comments) {
    try {
      const response = await api.put(`/audit-requests/${auditId}/reject`, {
        employeeComments: comments
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reject audit request' };
    }
  }

  async deleteAuditRequest(auditId) {
    try {
      const response = await api.delete(`/audit-requests/${auditId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete audit request' };
    }
  }
}

export default new AuditRequestService();