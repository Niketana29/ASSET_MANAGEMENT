import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AssetService from '../../services/AssetService';
import AssetAllocationService from '../../services/AssetAllocationService';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, getStatusBadgeClass } from '../../utils/constants';

const AssetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEmployeeId } = useAuth();
  
  const [asset, setAsset] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestReason, setRequestReason] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    if (id) {
      loadAssetDetails();
    }
  }, [id]);

  const loadAssetDetails = async () => {
    try {
      setIsLoading(true);
      const assetData = await AssetService.getAssetById(id);
      setAsset(assetData);
      setError('');
    } catch (err) {
      setError('Failed to load asset details');
      console.error('Error loading asset:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssetRequest = async () => {
    if (!asset || !getEmployeeId()) return;

    setIsRequesting(true);

    try {
      const requestData = {
        employeeId: getEmployeeId(),
        assetName: asset.assetName,
        requestReason: requestReason.trim() || 'Asset needed for work'
      };

      const response = await AssetAllocationService.requestAsset(requestData);
      
      if (response.isAutoApproved) {
        setSuccessMessage(`🎉 Asset "${asset.assetName}" has been auto-approved and allocated to you!`);
      } else {
        setSuccessMessage(`✅ Your request for "${asset.assetName}" has been submitted and is pending admin approval.`);
      }

      setShowRequestModal(false);
      
      setTimeout(() => setSuccessMessage(''), 5000);

    } catch (err) {
      setError('Failed to submit asset request');
      console.error('Error requesting asset:', err);
    } finally {
      setIsRequesting(false);
      setRequestReason('');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="asset-details-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading asset details...</p>
        </div>
      </div>
    );
  }

  if (error && !asset) {
    return (
      <div className="asset-details-container">
        <div className="error-state">
          <div className="error-icon">❌</div>
          <h3>Error Loading Asset</h3>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={() => navigate(-1)} className="back-button">
              Go Back
            </button>
            <button onClick={loadAssetDetails} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="asset-details-container">
        <div className="not-found-state">
          <div className="not-found-icon">🔍</div>
          <h3>Asset Not Found</h3>
          <p>The asset you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate(-1)} className="back-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="asset-details-container">
      <div className="page-header">
        <div className="header-navigation">
          <button onClick={() => navigate(-1)} className="back-button">
            ← Back
          </button>
          <div className="header-breadcrumb">
            <Link to="/browse-assets">Browse Assets</Link>
            <span className="breadcrumb-separator">•</span>
            <span className="current-page">Asset Details</span>
          </div>
        </div>
      </div>

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

      <div className="asset-details-card">
        <div className="asset-header">
          <div className="asset-title-section">
            <div className="asset-icon">
              {asset.isAutoApproved ? '⚡' : '📦'}
            </div>
            <div className="asset-title-info">
              <h1 className="asset-name">{asset.assetName}</h1>
              <div className="asset-meta">
                <span className="asset-number">#{asset.assetNo}</span>
                <span className="meta-separator">•</span>
                <span className="asset-category">{asset.categoryName}</span>
              </div>
            </div>
          </div>
          
          <div className="asset-status-section">
            <span className={getStatusBadgeClass(asset.status)}>
              {asset.status}
            </span>
            {asset.isAutoApproved && (
              <span className="auto-approved-badge">
                ⚡ Auto-approved
              </span>
            )}
          </div>
        </div>

        <div className="asset-info-grid">
          <div className="info-section">
            <h3 className="section-title">Basic Information</h3>
            <div className="info-items">
              <div className="info-item">
                <span className="info-label">Asset Number</span>
                <span className="info-value">{asset.assetNo}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Asset Name</span>
                <span className="info-value">{asset.assetName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Category</span>
                <span className="info-value">
                  {asset.categoryName}
                  {asset.isAutoApproved && (
                    <span className="category-badge">Auto-approved</span>
                  )}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Status</span>
                <span className={`info-value status-${asset.status.toLowerCase()}`}>
                  {asset.status}
                </span>
              </div>
            </div>
          </div>

          {(asset.assetModel || asset.manufacturingDate || asset.expiryDate || asset.assetValue) && (
            <div className="info-section">
              <h3 className="section-title">Technical Details</h3>
              <div className="info-items">
                {asset.assetModel && (
                  <div className="info-item">
                    <span className="info-label">Model</span>
                    <span className="info-value">{asset.assetModel}</span>
                  </div>
                )}
                {asset.manufacturingDate && (
                  <div className="info-item">
                    <span className="info-label">Manufacturing Date</span>
                    <span className="info-value">{formatDate(asset.manufacturingDate)}</span>
                  </div>
                )}
                {asset.expiryDate && (
                  <div className="info-item">
                    <span className="info-label">Expiry Date</span>
                    <span className="info-value">{formatDate(asset.expiryDate)}</span>
                  </div>
                )}
                {asset.assetValue && (
                  <div className="info-item">
                    <span className="info-label">Asset Value</span>
                    <span className="info-value asset-value">
                      {formatCurrency(asset.assetValue)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {asset.description && (
          <div className="description-section">
            <h3 className="section-title">Description</h3>
            <p className="asset-description">{asset.description}</p>
          </div>
        )}

        {asset.status === 'AVAILABLE' && (
          <div className="request-section">
            <div className="request-info">
              <h3 className="section-title">Request This Asset</h3>
              <p className="request-description">
                {asset.isAutoApproved 
                  ? 'This asset will be automatically approved and allocated to you immediately.'
                  : 'Submit a request to use this asset. Admin approval will be required.'
                }
              </p>
            </div>
            
            <button
              onClick={() => setShowRequestModal(true)}
              className="request-asset-button"
              disabled={isRequesting}
            >
              {asset.isAutoApproved ? (
                <>
                  ⚡ Quick Request
                </>
              ) : (
                <>
                  📋 Request Asset
                </>
              )}
            </button>
          </div>
        )}

        {asset.status !== 'AVAILABLE' && (
          <div className="unavailable-section">
            <div className="unavailable-notice">
              <span className="notice-icon">ℹ️</span>
              <div className="notice-content">
                <h4>Asset Unavailable</h4>
                <p>This asset is currently {asset.status.toLowerCase()} and cannot be requested at this time.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="related-actions">
        <h3 className="section-title">Related Actions</h3>
        <div className="action-cards">
          <Link to="/browse-assets" className="action-card blue">
            <span className="action-icon">🔍</span>
            <div className="action-content">
              <h4>Browse More Assets</h4>
              <p>Explore other available assets</p>
            </div>
          </Link>
          
          <Link to="/my-allocations" className="action-card green">
            <span className="action-icon">📦</span>
            <div className="action-content">
              <h4>My Assets</h4>
              <p>View your allocated assets</p>
            </div>
          </Link>
          
          <Link to="/raise-request" className="action-card purple">
            <span className="action-icon">➕</span>
            <div className="action-content">
              <h4>Custom Request</h4>
              <p>Request a specific asset by name</p>
            </div>
          </Link>
        </div>
      </div>

      {showRequestModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">Request Asset</h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="modal-close"
              >
                ✕
              </button>
            </div>

            <div className="modal-content">
              <div className="asset-summary">
                <div className="summary-icon">
                  {asset.isAutoApproved ? '⚡' : '📦'}
                </div>
                <div className="summary-details">
                  <h4 className="summary-name">{asset.assetName}</h4>
                  <p className="summary-info">
                    {asset.assetNo} • {asset.categoryName}
                  </p>
                  {asset.assetValue && (
                    <p className="summary-value">Value: {formatCurrency(asset.assetValue)}</p>
                  )}
                  {asset.isAutoApproved && (
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
                  maxLength={500}
                />
                <div className="character-count">
                  {requestReason.length}/500 characters
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                onClick={() => setShowRequestModal(false)}
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
                ) : asset.isAutoApproved ? (
                  'Request & Auto-Approve'
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetDetails;