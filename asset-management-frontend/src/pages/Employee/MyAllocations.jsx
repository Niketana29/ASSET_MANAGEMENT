import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AssetAllocationService from '../../services/AssetAllocationService';
import { useAuth } from '../../context/AuthContext';
import { getStatusBadgeClass, formatDate } from '../../utils/constants';
import './MyAllocations.css';

const MyAllocations = () => {
  const { getEmployeeId } = useAuth();
  const [allocations, setAllocations] = useState([]);
  const [filteredAllocations, setFilteredAllocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returningAllocation, setReturningAllocation] = useState(null);
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    if (getEmployeeId()) {
      loadAllocations();
    }
  }, [getEmployeeId()]);

  useEffect(() => {
    filterAllocations();
  }, [allocations, statusFilter]);

  const loadAllocations = async () => {
    try {
      setIsLoading(true);
      const data = await AssetAllocationService.getMyAllocations(getEmployeeId());
      setAllocations(data);
      setError('');
    } catch (err) {
      setError('Failed to load your allocations');
      console.error('Error loading allocations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAllocations = () => {
    let filtered = allocations;

    if (statusFilter) {
      filtered = filtered.filter(allocation => allocation.status === statusFilter);
    }

    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredAllocations(filtered);
  };

  const openReturnModal = (allocation) => {
    setReturningAllocation(allocation);
    setShowReturnModal(true);
  };

  const closeReturnModal = () => {
    setShowReturnModal(false);
    setReturningAllocation(null);
  };

  const handleReturn = async () => {
    if (!returningAllocation) return;

    setIsReturning(true);

    try {
      await AssetAllocationService.returnAsset(returningAllocation.allocationId);
      closeReturnModal();
      loadAllocations();
    } catch (err) {
      setError('Failed to return asset');
      console.error('Error returning asset:', err);
    } finally {
      setIsReturning(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'APPROVED':
        return {
          icon: '✅',
          text: 'Active',
          description: 'Asset is allocated to you'
        };
      case 'REQUESTED':
        return {
          icon: '⏳',
          text: 'Pending',
          description: 'Waiting for admin approval'
        };
      case 'REJECTED':
        return {
          icon: '❌',
          text: 'Rejected',
          description: 'Request was declined'
        };
      case 'RETURNED':
        return {
          icon: '↩️',
          text: 'Returned',
          description: 'Asset has been returned'
        };
      default:
        return {
          icon: '❓',
          text: status,
          description: ''
        };
    }
  };

  const AllocationCard = ({ allocation }) => {
    const statusInfo = getStatusInfo(allocation.status);

    return (
      <div className={`allocation-card ${allocation.status.toLowerCase()}`}>
        <div className="allocation-header">
          <div className="asset-info">
            <div className="asset-icon">{statusInfo.icon}</div>
            <div className="asset-details">
              <h3 className="asset-name">{allocation.assetName}</h3>
              <p className="asset-number">#{allocation.assetNo}</p>
              <p className="asset-category">{allocation.categoryName}</p>
            </div>
          </div>
          <div className="status-badge">
            <span className={getStatusBadgeClass(allocation.status)}>
              {statusInfo.text}
            </span>
          </div>
        </div>

        <div className="allocation-content">
          <div className="allocation-meta">
            <div className="meta-item">
              <span className="meta-label">Requested:</span>
              <span className="meta-value">
                {formatDate(allocation.createdAt, 'MMM DD, YYYY')}
              </span>
            </div>

            {allocation.allocatedDate && (
              <div className="meta-item">
                <span className="meta-label">Allocated:</span>
                <span className="meta-value">
                  {formatDate(allocation.allocatedDate, 'MMM DD, YYYY')}
                </span>
              </div>
            )}

            {allocation.returnDate && (
              <div className="meta-item">
                <span className="meta-label">Returned:</span>
                <span className="meta-value">
                  {formatDate(allocation.returnDate, 'MMM DD, YYYY')}
                </span>
              </div>
            )}

            {allocation.isAutoApproved && (
              <div className="meta-item">
                <span className="auto-approved-indicator">
                  <span className="indicator-icon">⚡</span>
                  Auto-approved
                </span>
              </div>
            )}
          </div>

          {allocation.requestReason && (
            <div className="request-reason">
              <span className="reason-label">Request Reason:</span>
              <p className="reason-text">{allocation.requestReason}</p>
            </div>
          )}

          {allocation.adminComments && (
            <div className="admin-comments">
              <span className="comments-label">Admin Comments:</span>
              <p className="comments-text">{allocation.adminComments}</p>
            </div>
          )}
        </div>

        <div className="allocation-actions">
          {allocation.status === 'APPROVED' && (
            <button
              onClick={() => openReturnModal(allocation)}
              className="return-button"
            >
              <span className="button-icon">↩️</span>
              Return Asset
            </button>
          )}
          
          {allocation.status === 'APPROVED' && (
            <Link
              to={`/service-request?assetId=${allocation.assetId}`}
              className="service-button"
            >
              <span className="button-icon">🔧</span>
              Service Request
            </Link>
          )}

          {allocation.status === 'REQUESTED' && (
            <div className="pending-notice">
              <span className="notice-icon">⏳</span>
              <span>Awaiting admin approval</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="my-allocations-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your assets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-allocations-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">My Assets</h1>
        <p className="page-subtitle">
          View and manage your allocated assets and requests
        </p>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">❌</span>
          <span>{error}</span>
        </div>
      )}

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card active">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">
              {allocations.filter(a => a.status === 'APPROVED').length}
            </div>
            <div className="stat-label">Active Assets</div>
          </div>
        </div>
        
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-number">
              {allocations.filter(a => a.status === 'REQUESTED').length}
            </div>
            <div className="stat-label">Pending Requests</div>
          </div>
        </div>

        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-number">{allocations.length}</div>
            <div className="stat-label">Total Requests</div>
          </div>
        </div>

        <div className="stat-card returned">
          <div className="stat-icon">↩️</div>
          <div className="stat-content">
            <div className="stat-number">
              {allocations.filter(a => a.status === 'RETURNED').length}
            </div>
            <div className="stat-label">Returned Assets</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label className="filter-label">Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="APPROVED">Active Assets</option>
            <option value="REQUESTED">Pending Requests</option>
            <option value="REJECTED">Rejected</option>
            <option value="RETURNED">Returned</option>
          </select>
        </div>
        
        <div className="results-info">
          <span className="results-count">
            {filteredAllocations.length} allocation{filteredAllocations.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Allocations List */}
      {filteredAllocations.length > 0 ? (
        <div className="allocations-grid">
          {filteredAllocations.map(allocation => (
            <AllocationCard key={allocation.allocationId} allocation={allocation} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3 className="empty-title">
            {statusFilter 
              ? `No ${statusFilter.toLowerCase()} allocations` 
              : 'No asset allocations yet'
            }
          </h3>
          <p className="empty-description">
            {statusFilter 
              ? 'Try selecting a different status filter'
              : 'Start by browsing and requesting assets from our inventory'
            }
          </p>
          <div className="empty-actions">
            {statusFilter && (
              <button
                onClick={() => setStatusFilter('')}
                className="clear-filter-button"
              >
                Clear Filter
              </button>
            )}
            <Link to="/browse-assets" className="browse-button">
              Browse Assets
            </Link>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {showReturnModal && returningAllocation && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">Return Asset</h3>
              <button onClick={closeReturnModal} className="modal-close">
                ✕
              </button>
            </div>

            <div className="modal-content">
              <div className="return-confirmation">
                <div className="confirmation-icon">⚠️</div>
                <div className="confirmation-text">
                  <h4>Are you sure you want to return this asset?</h4>
                  <p className="asset-details">
                    <strong>{returningAllocation.assetName}</strong> 
                    ({returningAllocation.assetNo})
                  </p>
                  <p className="warning-text">
                    Once returned, you'll need to make a new request to get this asset again.
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                onClick={closeReturnModal}
                className="cancel-button"
                disabled={isReturning}
              >
                Cancel
              </button>
              <button
                onClick={handleReturn}
                className="return-confirm-button"
                disabled={isReturning}
              >
                {isReturning ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    Returning...
                  </>
                ) : (
                  'Return Asset'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          <Link to="/browse-assets" className="quick-action-card blue">
            <span className="action-icon">🔍</span>
            <span className="action-text">Browse More Assets</span>
          </Link>
          <Link to="/raise-request" className="quick-action-card green">
            <span className="action-icon">➕</span>
            <span className="action-text">Quick Request</span>
          </Link>
          <Link to="/service-request" className="quick-action-card purple">
            <span className="action-icon">🔧</span>
            <span className="action-text">Service Request</span>
          </Link>
          <Link to="/request-history" className="quick-action-card orange">
            <span className="action-icon">📚</span>
            <span className="action-text">View History</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyAllocations;