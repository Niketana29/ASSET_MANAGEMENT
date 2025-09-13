import React, { useState, useEffect } from 'react';
import AuditRequestService from '../../services/AuditRequestService';
import AssetAllocationService from '../../services/AssetAllocationService';
import { getStatusBadgeClass, formatDate } from '../../utils/constants';

const AuditRequests = () => {
  const [auditRequests, setAuditRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingAllocations, setPendingAllocations] = useState([]);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState(null);
  const [adminComments, setAdminComments] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [auditRequests, statusFilter, searchTerm]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [auditData, pendingData] = await Promise.all([
        AuditRequestService.getAllAuditRequests(),
        AssetAllocationService.getPendingAllocations()
      ]);
      setAuditRequests(auditData);
      setPendingAllocations(pendingData);
      setError('');
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = auditRequests;

    if (statusFilter) {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.assetNo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  };

  const createAuditRequestsForAll = async () => {
    try {
      const response = await AuditRequestService.createAuditRequestsForAll();
      setSuccessMessage(`Created ${response.length} audit requests for employees with allocated assets.`);
      loadData();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError('Failed to create audit requests');
      console.error('Error creating audit requests:', err);
    }
  };

  const openApprovalModal = (allocation) => {
    setSelectedAllocation(allocation);
    setAdminComments('');
    setShowApprovalModal(true);
  };

  const closeApprovalModal = () => {
    setShowApprovalModal(false);
    setSelectedAllocation(null);
    setAdminComments('');
  };

  const handleApproveAllocation = async () => {
    if (!selectedAllocation) return;

    setIsProcessing(true);
    try {
      await AssetAllocationService.approveAllocation(
        selectedAllocation.allocationId,
        adminComments || 'Request approved by admin'
      );
      setSuccessMessage(`Asset allocation approved for ${selectedAllocation.employeeName}`);
      closeApprovalModal();
      loadData();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError('Failed to approve allocation');
      console.error('Error approving allocation:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectAllocation = async () => {
    if (!selectedAllocation) return;

    setIsProcessing(true);
    try {
      await AssetAllocationService.rejectAllocation(
        selectedAllocation.allocationId,
        adminComments || 'Request rejected by admin'
      );
      setSuccessMessage(`Asset allocation rejected for ${selectedAllocation.employeeName}`);
      closeApprovalModal();
      loadData();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError('Failed to reject allocation');
      console.error('Error rejecting allocation:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading audit requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Audit & Asset Requests</h1>
        <p className="mt-2 text-gray-600">Manage asset allocation requests and audit compliance</p>
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

      {/* Pending Allocations Section */}
      {pendingAllocations.length > 0 && (
        <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="text-yellow-500 text-xl mr-2">⏳</span>
              <h2 className="text-xl font-semibold text-yellow-900">
                Pending Asset Allocations ({pendingAllocations.length})
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pendingAllocations.map((allocation) => (
              <div key={allocation.allocationId} className="bg-white rounded-lg p-4 border border-yellow-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{allocation.assetName}</h3>
                    <p className="text-sm text-gray-600">
                      {allocation.assetNo} • {allocation.categoryName}
                    </p>
                    <p className="text-sm text-gray-800 mt-1">
                      Requested by: <span className="font-medium">{allocation.employeeName}</span>
                    </p>
                    {allocation.requestReason && (
                      <p className="text-sm text-gray-600 mt-1">
                        Reason: {allocation.requestReason}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Requested: {formatDate(allocation.createdAt, 'MMM DD, YYYY HH:mm')}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => openApprovalModal(allocation)}
                      className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                    >
                      Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Requests Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Audit Requests</h2>
              <p className="text-gray-600 text-sm">Track asset verification by employees</p>
            </div>
            <button
              onClick={createAuditRequestsForAll}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Audit Requests
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search by employee or asset..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="VERIFIED">Verified</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audit Requests List */}
        <div className="divide-y divide-gray-200">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No audit requests found</h3>
              <p className="text-gray-500">
                {auditRequests.length === 0 
                  ? 'Create audit requests for employees with allocated assets.'
                  : 'Try adjusting your search criteria.'
                }
              </p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request.auditId} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">📋</div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {request.assetName} ({request.assetNo})
                        </h3>
                        <p className="text-sm text-gray-600">
                          Employee: {request.employeeName} ({request.employeeEmail})
                        </p>
                      </div>
                    </div>
                    
                    {request.employeeComments && (
                      <div className="mt-2 ml-11">
                        <p className="text-sm text-gray-700 bg-gray-100 p-2 rounded">
                          <strong>Employee Comments:</strong> {request.employeeComments}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className={getStatusBadgeClass(request.status)}>
                        {request.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {request.auditDate 
                          ? `Verified: ${formatDate(request.auditDate, 'MMM DD, YYYY')}`
                          : `Created: ${formatDate(request.createdAt, 'MMM DD, YYYY')}`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedAllocation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Review Asset Request</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900">{selectedAllocation.assetName}</h4>
                <p className="text-sm text-gray-600">{selectedAllocation.assetNo}</p>
                <p className="text-sm text-gray-600">Category: {selectedAllocation.categoryName}</p>
                <p className="text-sm text-gray-800 mt-2">
                  Requested by: <span className="font-medium">{selectedAllocation.employeeName}</span>
                </p>
                {selectedAllocation.requestReason && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-700">
                      <strong>Reason:</strong> {selectedAllocation.requestReason}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Comments
                </label>
                <textarea
                  rows={3}
                  value={adminComments}
                  onChange={(e) => setAdminComments(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your comments..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeApprovalModal}
                disabled={isProcessing}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectAllocation}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Reject'}
              </button>
              <button
                onClick={handleApproveAllocation}
                disabled={isProcessing}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditRequests;