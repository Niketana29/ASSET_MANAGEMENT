import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AssetService from '../../services/AssetService';
import CategoryService from '../../services/CategoryService';
import AssetAllocationService from '../../services/AssetAllocationService';
import { useAuth } from '../../context/AuthContext';
import { getStatusBadgeClass, formatCurrency } from '../../utils/constants';
import './BrowseAssets.css';

const BrowseAssets = () => {
  const { getEmployeeId } = useAuth();
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [requestReason, setRequestReason] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndSortAssets();
  }, [assets, searchTerm, categoryFilter, sortBy]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [assetsData, categoriesData] = await Promise.all([
        AssetService.getAvailableAssets(),
        CategoryService.getAllCategories()
      ]);
      setAssets(assetsData);
      setCategories(categoriesData);
      setError('');
    } catch (err) {
      setError('Failed to load assets');
      console.error('Error loading assets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortAssets = () => {
    let filtered = assets.filter(asset => asset.status === 'AVAILABLE');

    if (searchTerm) {
      filtered = filtered.filter(asset =>
        asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.assetNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(asset => asset.categoryId.toString() === categoryFilter);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.assetName.localeCompare(b.assetName);
        case 'category':
          return a.categoryName.localeCompare(b.categoryName);
        case 'value':
          return (b.assetValue || 0) - (a.assetValue || 0);
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });

    setFilteredAssets(filtered);
  };

  const openRequestModal = (asset) => {
    setSelectedAsset(asset);
    setRequestReason('');
    setShowRequestModal(true);
  };

  const closeRequestModal = () => {
    setShowRequestModal(false);
    setSelectedAsset(null);
    setRequestReason('');
  };

  const handleAssetRequest = async () => {
    if (!selectedAsset || !getEmployeeId()) return;

    setIsRequesting(true);

    try {
      const requestData = {
        employeeId: getEmployeeId(),
        assetName: selectedAsset.assetName,
        requestReason: requestReason.trim() || 'Asset needed for work'
      };

      const response = await AssetAllocationService.requestAsset(requestData);
      
      if (response.isAutoApproved) {
        setSuccessMessage(`🎉 Asset "${selectedAsset.assetName}" has been auto-approved and allocated to you!`);
      } else {
        setSuccessMessage(`✅ Your request for "${selectedAsset.assetName}" has been submitted and is pending admin approval.`);
      }

      closeRequestModal();
      loadData(); 
      setTimeout(() => setSuccessMessage(''), 5000);

    } catch (err) {
      setError('Failed to submit asset request');
      console.error('Error requesting asset:', err);
    } finally {
      setIsRequesting(false);
    }
  };

  const AssetCard = ({ asset }) => (
    <div className="asset-card">
      <div className="asset-card-header">
        <div className="asset-icon">
          {asset.isAutoApproved ? '⚡' : '📦'}
        </div>
        <div className="asset-status-badges">
          {asset.isAutoApproved && (
            <span className="auto-approved-badge">
              Auto-approved
            </span>
          )}
          <span className={getStatusBadgeClass(asset.status)}>
            {asset.status}
          </span>
        </div>
      </div>

      <div className="asset-card-content">
        <h3 className="asset-name">{asset.assetName}</h3>
        <p className="asset-number">Asset #{asset.assetNo}</p>
        <p className="asset-category">{asset.categoryName}</p>
        
        {asset.assetModel && (
          <p className="asset-model">Model: {asset.assetModel}</p>
        )}
        
        {asset.assetValue && (
          <p className="asset-value">Value: {formatCurrency(asset.assetValue)}</p>
        )}

        {asset.description && (
          <p className="asset-description">
            {asset.description.length > 100 
              ? `${asset.description.substring(0, 100)}...` 
              : asset.description
            }
          </p>
        )}
      </div>

      <div className="asset-card-actions">
        <button
          onClick={() => openRequestModal(asset)}
          className="request-button"
        >
          {asset.isAutoApproved ? (
            <>
              <span className="mr-1">⚡</span>
              Quick Request
            </>
          ) : (
            <>
              <span className="mr-1">📋</span>
              Request Asset
            </>
          )}
        </button>
        
        <Link
          to={`/asset-details/${asset.assetId}`}
          className="details-button"
        >
          View Details
        </Link>
      </div>

      {asset.isAutoApproved && (
        <div className="auto-approved-notice">
          <span className="notice-icon">ℹ️</span>
          <span>This asset will be approved instantly</span>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="browse-assets-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading available assets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="browse-assets-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Browse Assets</h1>
        <p className="page-subtitle">
          Discover and request assets available for allocation
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="error-message">
          <span className="error-icon">❌</span>
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="success-message">
          <span className="success-icon">✅</span>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">Search Assets</label>
            <div className="search-input-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by name, number, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName} 
                  {category.isAutoApproved && ' ⚡'}
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
              <option value="name">Asset Name</option>
              <option value="category">Category</option>
              <option value="value">Value (High to Low)</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        <div className="results-info">
          <span className="results-count">
            {filteredAssets.length} asset{filteredAssets.length !== 1 ? 's' : ''} available
          </span>
        </div>
      </div>

      {/* Assets Grid */}
      {filteredAssets.length > 0 ? (
        <div className="assets-grid">
          {filteredAssets.map(asset => (
            <AssetCard key={asset.assetId} asset={asset} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3 className="empty-title">No assets found</h3>
          <p className="empty-description">
            {searchTerm || categoryFilter 
              ? 'Try adjusting your search criteria'
              : 'No assets are currently available for allocation'
            }
          </p>
          {(searchTerm || categoryFilter) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
              }}
              className="clear-filters-button"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Request Modal */}
      {showRequestModal && selectedAsset && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">Request Asset</h3>
              <button
                onClick={closeRequestModal}
                className="modal-close"
              >
                ✕
              </button>
            </div>

            <div className="modal-content">
              <div className="asset-summary">
                <div className="summary-icon">
                  {selectedAsset.isAutoApproved ? '⚡' : '📦'}
                </div>
                <div className="summary-details">
                  <h4 className="summary-name">{selectedAsset.assetName}</h4>
                  <p className="summary-info">
                    {selectedAsset.assetNo} • {selectedAsset.categoryName}
                  </p>
                  {selectedAsset.isAutoApproved && (
                    <div className="auto-approval-notice">
                      <span className="notice-icon">⚡</span>
                      <span>This request will be approved automatically</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Reason for Request <span className="optional">(Optional)</span>
                </label>
                <textarea
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  placeholder="Please provide a reason for requesting this asset..."
                  className="reason-textarea"
                  rows={4}
                />
                <div className="character-count">
                  {requestReason.length}/500 characters
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                onClick={closeRequestModal}
                className="cancel-button"
                disabled={isRequesting}
              >
                Cancel
              </button>
              <button
                onClick={handleAssetRequest}
                className="submit-button"
                disabled={isRequesting}
              >
                {isRequesting ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    Submitting...
                  </>
                ) : selectedAsset.isAutoApproved ? (
                  'Request & Auto-Approve'
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <div className="quick-actions-header">
          <h2 className="section-title">Quick Actions</h2>
        </div>
        <div className="quick-actions-grid">
          <Link to="/my-allocations" className="quick-action-card blue">
            <span className="action-icon">📦</span>
            <span className="action-text">View My Assets</span>
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
            <span className="action-text">Request History</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BrowseAssets;