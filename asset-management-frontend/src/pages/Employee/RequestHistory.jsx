import React, { useState, useEffect } from 'react';
import AssetAllocationService from '../../services/AssetAllocationService';
import ServiceRequestService from '../../services/ServiceRequestService';
import { useAuth } from '../../context/AuthContext';
import { getStatusBadgeClass, ALLOCATION_STATUS, SERVICE_STATUS } from '../../utils/constants';

const RequestHistory = () => {
  const { getEmployeeId } = useAuth();
  
  const [allocationRequests, setAllocationRequests] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'asset', 'service'
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  // Combined and filtered data
  const [displayRequests, setDisplayRequests] = useState([]);

  useEffect(() => {
    loadRequestHistory();
  }, []);

  useEffect(() => {
    combineAndFilterRequests();
  }, [allocationRequests, serviceRequests, activeTab, statusFilter, sortBy]);

  const loadRequestHistory = async () => {
    try {
      setIsLoading(true);
      const employeeId = getEmployeeId();
      
      if (!employeeId) {
        setError('User session expired. Please login again.');
        return;
      }

      const [allocations, serviceReqs] = await Promise.all([
        AssetAllocationService.getMyAllocations(employeeId),
        ServiceRequestService.getMyServiceRequests(employeeId)
      ]);

      setAllocationRequests(allocations);
      setServiceRequests(serviceReqs);
      setError('');

    } catch (err) {
      setError('Failed to load request history');
      console.error('Error loading request history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const combineAndFilterRequests = () => {
    let combined = [];

    // Add allocation requests
    if (activeTab === 'all' || activeTab === 'asset') {
      const mappedAllocations = allocationRequests.map(req => ({
        ...req,
        requestType: 'ASSET',
        requestId: `A-${req.allocationId}`,
        title: `Asset Request - ${req.assetName}`,
        description: req.requestReason || 'No reason provided',
        dateCreated: req.createdAt,
        lastUpdated: req.updatedAt || req.createdAt
      }));
      combined = [...combined, ...mappedAllocations];
    }

    // Add service requests
    if (activeTab === 'all' || activeTab === 'service') {
      const mappedServiceRequests = serviceRequests.map(req => ({
        ...req,
        requestType: 'SERVICE',
        requestId: `S-${req.requestId}`,
        title: `Service Request - ${req.assetName}`,
        description: req.description,
        dateCreated: req.createdAt,
        lastUpdated: req.updatedAt || req.createdAt
      }));
      combined = [...combined, ...mappedServiceRequests];
    }

    // Apply status filter
    if (statusFilter) {
      combined = combined.filter(req => req.status === statusFilter);
    }

    // Apply sorting
    combined.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.dateCreated) - new Date(a.dateCreated);
        case 'oldest':
          return new Date(a.dateCreated) - new Date(b.dateCreated);
        case 'updated':
          return new Date(b.lastUpdated) - new Date(a.lastUpdated);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'type':
          return a.requestType.localeCompare(b.requestType);
        default:
          return 0;
      }
    });

    setDisplayRequests(combined);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRequestTypeIcon = (type) => {
    return type === 'ASSET' ? '📦' : '🔧';
  };

  const getRequestTypeName = (type) => {
    return type === 'ASSET' ? 'Asset Request' : 'Service Request';
  };

  const getAllStatusOptions = () => {
    const assetStatuses = Object.values(ALLOCATION_STATUS);
    const serviceStatuses = Object.values(SERVICE_STATUS);
    return [...new Set([...assetStatuses, ...serviceStatuses])];
  };

  const getRequestStats = () => {
    return {
      total: displayRequests.length,
      asset: displayRequests.filter(r => r.requestType === 'ASSET').length,
      service: displayRequests.filter(r => r.requestType === 'SERVICE').length,
      pending: displayRequests.filter(r => ['REQUESTED', 'PENDING'].includes(r.status)).length,
      approved: displayRequests.filter(r => ['APPROVED', 'COMPLETED'].includes(r.status)).length,
      rejected: displayRequests.filter(r => r.status === 'REJECTED').length
    };
  };

  if (isLoading) {
    return (
      <div className="request-history-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your request history...</p>
        </div>
      </div>
    );
  }

  const stats = getRequestStats();

  return (
    <div className="request-history-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Request History</h1>
        <p className="page-subtitle">
          View all your asset allocation and service requests
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span className="error-icon">❌</span>
          <span>{error}</span>
          <button onClick={() => setError('')} className="message-close">✕</button>
        </div>
      )}

      {/* Statistics */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Requests</div>
            </div>
          </div>
          
          <div className="stat-card asset">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <div className="stat-number">{stats.asset}</div>
              <div className="stat-label">Asset Requests</div>
            </div>
          </div>
          
          <div className="stat-card service">
            <div className="stat-icon">🔧</div>
            <div className="stat-content">
              <div className="stat-number">{stats.service}</div>
              <div className="stat-label">Service Requests</div>
            </div>
          </div>
          
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-number">{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <span className="tab-icon">📋</span>
            All Requests
          </button>
          <button
            className={`tab-button ${activeTab === 'asset' ? 'active' : ''}`}
            onClick={() => setActiveTab('asset')}
          >
            <span className="tab-icon">📦</span>
            Asset Requests
          </button>
          <button
            className={`tab-button ${activeTab === 'service' ? 'active' : ''}`}
            onClick={() => setActiveTab('service')}
          >
            <span className="tab-icon">🔧</span>
            Service Requests
          </button>
        </div>

        {/* Filters */}
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Statuses</option>
              {getAllStatusOptions().map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="updated">Recently Updated</option>
              <option value="status">Status</option>
              <option value="type">Request Type</option>
            </select>
          </div>
        </div>

        <div className="results-info">
          <span className="results-count">
            Showing {displayRequests.length} request{displayRequests.length !== 1 ? 's' : ''}
          </span>
          <button 
            onClick={loadRequestHistory}
            className="refresh-button"
            disabled={isLoading}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Request List */}
      {displayRequests.length > 0 ? (
        <div className="requests-list">
          {displayRequests.map((request) => (
            <div key={request.requestId} className="request-card">
              <div className="request-header">
                <div className="request-type-badge">
                  <span className="type-icon">{getRequestTypeIcon(request.requestType)}</span>
                  <span className="type-name">{getRequestTypeName(request.requestType)}</span>
                </div>
                
                <div className="request-status">
                  <span className={getStatusBadgeClass(request.status)}>
                    {request.status}
                  </span>
                  {request.requestType === 'ASSET' && request.isAutoApproved && (
                    <span className="auto-approved-indicator">⚡ Auto-approved</span>
                  )}
                </div>
              </div>

              <div className="request-content">
                <h3 className="request-title">{request.title}</h3>
                <p className="request-description">{request.description}</p>

                <div className="request-details">
                  <div className="detail-item">
                    <span className="detail-label">Asset:</span>
                    <span className="detail-value">
                      {request.assetName} ({request.assetNo})
                    </span>
                  </div>
                  
                  {request.requestType === 'ASSET' && request.categoryName && (
                    <div className="detail-item">
                      <span className="detail-label">Category:</span>
                      <span className="detail-value">{request.categoryName}</span>
                    </div>
                  )}
                  
                  {request.requestType === 'SERVICE' && request.issueType && (
                    <div className="detail-item">
                      <span className="detail-label">Issue Type:</span>
                      <span className="detail-value">{request.issueType}</span>
                    </div>
                  )}

                  <div className="detail-item">
                    <span className="detail-label">Requested On:</span>
                    <span className="detail-value">{formatDate(request.dateCreated)}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Last Updated:</span>
                    <span className="detail-value">{formatDate(request.lastUpdated)}</span>
                  </div>
                </div>

                {/* Actions for Service Requests */}
                {request.requestType === 'SERVICE' && (
                  <div className="request-actions">
                    <button
                      className="btn btn-danger"
                      onClick={async () => {
                        const confirmDelete = window.confirm(
                          'Are you sure you want to delete this service request?'
                        );
                        if (!confirmDelete) return;
                        try {
                          await ServiceRequestService.deleteServiceRequest(request.requestId.split('-')[1]);
                          setServiceRequests(prev => prev.filter(r => r.requestId !== request.requestId));
                        } catch (err) {
                          console.error('Failed to delete service request:', err);
                          alert('Failed to delete service request.');
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-requests-message">No requests found.</p>
      )}
    </div>
  );
};

export default RequestHistory;
