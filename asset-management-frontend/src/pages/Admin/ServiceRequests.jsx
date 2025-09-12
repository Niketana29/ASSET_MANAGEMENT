import React, { useState, useEffect } from 'react';
import ServiceRequestService from '../../services/ServiceRequestService';
import { getStatusBadgeClass, formatDate } from '../../utils/constants';

const ServiceRequests = () => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [adminComments, setAdminComments] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadServiceRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [serviceRequests, statusFilter, searchTerm]);

  const loadServiceRequests = async () => {
    try {
      setIsLoading(true);
      const data = await ServiceRequestService.getAllServiceRequests();
      setServiceRequests(data);
      setError('');
    } catch (err) {
      setError('Failed to load service requests');
      console.error('Error loading service requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = serviceRequests;

    if (statusFilter) {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.assetNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.issueType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredRequests(filtered);
  };

  const openModal = (request) => {
    setSelectedRequest(request);
    setNewStatus(request.status);
    setAdminComments(request.adminComments || '');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setNewStatus('');
    setAdminComments('');
  };

  const handleUpdateStatus = async () => {
    if (!selectedRequest || !newStatus) return;

    setIsUpdating(true);

    try {
      await ServiceRequestService.updateServiceRequestStatus(
        selectedRequest.requestId,
        newStatus,
        adminComments
      );

      setSuccessMessage(`Service request status updated to ${newStatus.toLowerCase()}`);
      closeModal();
      loadServiceRequests();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError('Failed to update service request status');
      console.error('Error updating status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  // --- Added helper functions (safe additions) ---
  const loadPendingRequests = async () => {
    setIsLoading(true);
    try {
      const data = await ServiceRequestService.getPendingServiceRequests();
      setServiceRequests(data);
      setError('');
    } catch (err) {
      setError('Failed to load pending service requests');
      console.error('Error loading pending service requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (requestId) => {
    const confirmed = window.confirm('Are you sure you want to delete this service request? This action cannot be undone.');
    if (!confirmed) return;

    setIsUpdating(true);
    try {
      await ServiceRequestService.deleteServiceRequest(requestId);
      setSuccessMessage('Service request deleted successfully');
      await loadServiceRequests();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setError('Failed to delete service request');
      console.error('Error deleting service request:', err);
    } finally {
      setIsUpdating(false);
    }
  };
  // --- end helper functions ---

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600';
      case 'IN_PROGRESS':
        return 'text-blue-600';
      case 'COMPLETED':
        return 'text-green-600';
      case 'REJECTED':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getIssueTypeIcon = (issueType) => {
    switch (issueType) {
      case 'MALFUNCTION':
        return '⚠️';
      case 'REPAIR':
        return '🔧';
      case 'MAINTENANCE':
        return '🛠️';
      case 'OTHER':
        return '❓';
      default:
        return '🔧';
    }
  };

  const getStatusCount = (status) => {
    return serviceRequests.filter(request => request.status === status).length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Service Requests</h1>
        <p className="mt-2 text-gray-600">Manage and track asset service and maintenance requests</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          {successMessage}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 text-xl">⏳</span>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-yellow-900">{getStatusCount('PENDING')}</div>
              <div className="text-sm text-yellow-700">Pending</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">🔄</span>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-blue-900">{getStatusCount('IN_PROGRESS')}</div>
              <div className="text-sm text-blue-700">In Progress</div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">✅</span>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-green-900">{getStatusCount('COMPLETED')}</div>
              <div className="text-sm text-green-700">Completed</div>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-red-600 text-xl">❌</span>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-red-900">{getStatusCount('REJECTED')}</div>
              <div className="text-sm text-red-700">Rejected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters / Controls */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by employee, asset, asset no, or issue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
          >
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadServiceRequests}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            title="Refresh list"
          >
            Refresh
          </button>
          <button
            onClick={loadPendingRequests}
            className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            title="Show pending only"
          >
            Quick: Pending
          </button>
        </div>
      </div>

      {/* Service requests list */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-white rounded-md border border-gray-100">
            No service requests match your filters.
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div key={req.requestId} className="flex justify-between bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-start gap-4">
                <div className="text-2xl mt-1">{getIssueTypeIcon(req.issueType)}</div>
                <div>
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-lg font-semibold">{req.assetName || req.assetNo}</h3>
                    <span className="text-sm text-gray-500">{req.assetNo}</span>
                  </div>

                  <div className="text-sm text-gray-600 mt-1">
                    Requested by: <span className="font-medium">{req.employeeName}</span> • {req.employeeEmail}
                  </div>

                  <div className="mt-2 text-sm text-gray-700">{req.description}</div>

                  <div className="mt-2 text-xs text-gray-500">
                    Created: {formatDate(req.createdAt)}
                    {req.updatedAt && ` • Updated: ${formatDate(req.updatedAt)}`}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <div>
                  {/* status badge — getStatusBadgeClass expected to return className */}
                  <span className={getStatusBadgeClass ? getStatusBadgeClass(req.status) : getStatusColor(req.status)}>
                    {req.status}
                  </span>
                </div>

                <div className="flex flex-col w-36">
                  <button
                    onClick={() => openModal(req)}
                    className="w-full px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                  >
                    Update Status
                  </button>

                  <button
                    onClick={() => handleDelete(req.requestId)}
                    className="w-full mt-2 px-3 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                    disabled={isUpdating}
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => window.open(`/admin/service-requests/${req.requestId}`, '_blank')}
                    className="w-full mt-2 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm hover:bg-gray-50"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Update status modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-11/12 md:w-1/2 p-6 shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">Update Service Request</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedRequest.assetName} • {selectedRequest.assetNo}
                </p>
              </div>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">✖</button>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              >
                <option value="PENDING">PENDING</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Admin Comments (optional)</label>
              <textarea
                rows={4}
                value={adminComments}
                onChange={(e) => setAdminComments(e.target.value)}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                placeholder="Add notes for the employee..."
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRequests;
