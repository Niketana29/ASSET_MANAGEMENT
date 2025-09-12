import React, { useState, useEffect } from 'react';
import AssetAllocationService from '../../services/AssetAllocationService';
import ServiceRequestService from '../../services/ServiceRequestService';
import { useAuth } from '../../context/AuthContext';
import { ISSUE_TYPES, VALIDATION_MESSAGES } from '../../utils/constants';

const ServiceRequest = () => {
  const { getEmployeeId } = useAuth();
  
  const [myAssets, setMyAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [formData, setFormData] = useState({
    description: '',
    issueType: ''
  });
  
  const [isLoadingAssets, setIsLoadingAssets] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    loadMyAssets();
  }, []);

  const loadMyAssets = async () => {
    try {
      setIsLoadingAssets(true);
      const employeeId = getEmployeeId();
      if (!employeeId) {
        setError('User session expired. Please login again.');
        return;
      }

      const allocations = await AssetAllocationService.getMyAllocations(employeeId);
      // Filter only approved allocations that haven't been returned
      const activeAssets = allocations.filter(
        allocation => allocation.status === 'APPROVED' && !allocation.returnDate
      );
      setMyAssets(activeAssets);
      setError('');
    } catch (err) {
      setError('Failed to load your allocated assets');
      console.error('Error loading assets:', err);
    } finally {
      setIsLoadingAssets(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!selectedAsset) {
      errors.selectedAsset = VALIDATION_MESSAGES.REQUIRED;
    }

    if (!formData.description.trim()) {
      errors.description = VALIDATION_MESSAGES.REQUIRED;
    } else if (formData.description.trim().length < 10) {
      errors.description = VALIDATION_MESSAGES.MIN_LENGTH('Description', 10);
    } else if (formData.description.trim().length > 1000) {
      errors.description = VALIDATION_MESSAGES.MAX_LENGTH('Description', 1000);
    }

    if (!formData.issueType) {
      errors.issueType = VALIDATION_MESSAGES.REQUIRED;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAssetChange = (e) => {
    setSelectedAsset(e.target.value);
    if (validationErrors.selectedAsset) {
      setValidationErrors(prev => ({
        ...prev,
        selectedAsset: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the validation errors before submitting');
      return;
    }

    if (!getEmployeeId()) {
      setError('User session expired. Please login again.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const asset = myAssets.find(a => a.allocationId.toString() === selectedAsset);
      
      const serviceRequestData = {
        employeeId: getEmployeeId(),
        assetId: asset.assetId,
        assetNo: asset.assetNo,
        description: formData.description.trim(),
        issueType: formData.issueType
      };

      await ServiceRequestService.createServiceRequest(serviceRequestData);
      
      setSuccessMessage(`Service request submitted successfully for ${asset.assetName}! Your request is now pending admin review.`);

      // Reset form
      setSelectedAsset('');
      setFormData({
        description: '',
        issueType: ''
      });
      setValidationErrors({});
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);

    } catch (err) {
      setError(err.message || 'Failed to submit service request');
      console.error('Error submitting service request:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setSelectedAsset('');
    setFormData({
      description: '',
      issueType: ''
    });
    setValidationErrors({});
    setError('');
  };

  const getSelectedAssetInfo = () => {
    if (!selectedAsset) return null;
    return myAssets.find(asset => asset.allocationId.toString() === selectedAsset);
  };

  const getIssueTypeIcon = (type) => {
    switch (type) {
      case 'MALFUNCTION': return '⚠️';
      case 'REPAIR': return '🔧';
      case 'MAINTENANCE': return '🛠️';
      case 'OTHER': return '❓';
      default: return '📋';
    }
  };

  const getIssueTypeDescription = (type) => {
    switch (type) {
      case 'MALFUNCTION': return 'Asset is not working correctly or has stopped functioning';
      case 'REPAIR': return 'Asset needs to be repaired due to damage';
      case 'MAINTENANCE': return 'Asset requires routine maintenance or servicing';
      case 'OTHER': return 'Other issues not covered by the above categories';
      default: return '';
    }
  };

  if (isLoadingAssets) {
    return (
      <div className="service-request-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your allocated assets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="service-request-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Service Request</h1>
        <p className="page-subtitle">
          Report issues or request maintenance for your allocated assets
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="error-message">
          <span className="error-icon">❌</span>
          <span>{error}</span>
          <button 
            onClick={() => setError('')}
            className="message-close"
          >
            ✕
          </button>
        </div>
      )}

      {successMessage && (
        <div className="success-message">
          <span className="success-icon">✅</span>
          <span>{successMessage}</span>
          <button 
            onClick={() => setSuccessMessage('')}
            className="message-close"
          >
            ✕
          </button>
        </div>
      )}

      {myAssets.length === 0 ? (
        <div className="no-assets-state">
          <div className="no-assets-icon">📦</div>
          <h3 className="no-assets-title">No Assets Allocated</h3>
          <p className="no-assets-description">
            You don't have any allocated assets to request service for. 
            Please browse and request assets first.
          </p>
          <div className="no-assets-actions">
            <a href="/browse-assets" className="browse-assets-button">
              Browse Assets
            </a>
            <a href="/raise-request" className="raise-request-button">
              Request Asset
            </a>
          </div>
        </div>
      ) : (
        <div className="service-request-content">
          {/* Service Request Form */}
          <div className="form-section">
            <div className="form-card">
              <div className="form-header">
                <h2 className="form-title">Submit Service Request</h2>
                <p className="form-description">
                  Select an asset and describe the issue you're experiencing
                </p>
              </div>

              <form onSubmit={handleSubmit} className="service-form">
                {/* Asset Selection */}
                <div className="form-group">
                  <label htmlFor="selectedAsset" className="form-label">
                    Select Asset <span className="required">*</span>
                  </label>
                  <select
                    id="selectedAsset"
                    value={selectedAsset}
                    onChange={handleAssetChange}
                    className={`form-select ${validationErrors.selectedAsset ? 'error' : ''}`}
                  >
                    <option value="">Choose an asset...</option>
                    {myAssets.map(asset => (
                      <option key={asset.allocationId} value={asset.allocationId}>
                        {asset.assetName} - {asset.assetNo} ({asset.categoryName})
                      </option>
                    ))}
                  </select>
                  {validationErrors.selectedAsset && (
                    <span className="error-text">{validationErrors.selectedAsset}</span>
                  )}
                  <div className="input-help">
                    Select the asset you need service for from your allocated assets
                  </div>
                </div>

                {/* Issue Type */}
                <div className="form-group">
                  <label htmlFor="issueType" className="form-label">
                    Issue Type <span className="required">*</span>
                  </label>
                  <div className="issue-type-grid">
                    {Object.entries(ISSUE_TYPES).map(([key, value]) => (
                      <div 
                        key={key}
                        className={`issue-type-option ${formData.issueType === value ? 'selected' : ''}`}
                        onClick={() => {
                          handleInputChange({ target: { name: 'issueType', value } });
                        }}
                      >
                        <div className="issue-type-header">
                          <span className="issue-type-icon">{getIssueTypeIcon(value)}</span>
                          <span className="issue-type-name">{value}</span>
                        </div>
                        <p className="issue-type-description">
                          {getIssueTypeDescription(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                  {validationErrors.issueType && (
                    <span className="error-text">{validationErrors.issueType}</span>
                  )}
                </div>

                {/* Description */}
                <div className="form-group">
                  <label htmlFor="description" className="form-label">
                    Describe the Issue <span className="required">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Please provide detailed information about the issue, what you were doing when it occurred, and any error messages you received..."
                    className={`form-textarea ${validationErrors.description ? 'error' : ''}`}
                    rows={5}
                    maxLength={1000}
                  />
                  {validationErrors.description && (
                    <span className="error-text">{validationErrors.description}</span>
                  )}
                  <div className="character-count">
                    {formData.description.length}/1000 characters
                    <span className="min-required">(minimum 10 characters)</span>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                  <button
                    type="button"
                    onClick={clearForm}
                    className="clear-button"
                    disabled={isSubmitting}
                  >
                    Clear Form
                  </button>
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting || !selectedAsset || !formData.description.trim() || !formData.issueType}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="loading-spinner-small"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        🔧 Submit Service Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Request Preview */}
          <div className="preview-section">
            <div className="preview-card">
              <div className="preview-header">
                <h3 className="preview-title">Request Preview</h3>
                <span className="preview-icon">🔧</span>
              </div>

              <div className="preview-content">
                {selectedAsset && formData.issueType ? (
                  <>
                    {/* Asset Information */}
                    <div className="preview-asset">
                      <h4 className="preview-section-title">Asset Information</h4>
                      {(() => {
                        const asset = getSelectedAssetInfo();
                        return asset ? (
                          <div className="asset-preview-card">
                            <div className="asset-preview-header">
                              <span className="asset-icon">📦</span>
                              <div className="asset-preview-info">
                                <h5 className="asset-name">{asset.assetName}</h5>
                                <p className="asset-details">
                                  {asset.assetNo} • {asset.categoryName}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>

                    {/* Issue Information */}
                    <div className="preview-issue">
                      <h4 className="preview-section-title">Issue Details</h4>
                      <div className="issue-preview">
                        <div className="issue-type-preview">
                          <span className="issue-icon">{getIssueTypeIcon(formData.issueType)}</span>
                          <span className="issue-name">{formData.issueType}</span>
                        </div>
                        {formData.description && (
                          <div className="issue-description-preview">
                            <strong>Description:</strong>
                            <p>{formData.description}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Service Info */}
                    <div className="service-info">
                      <div className="info-notice">
                        <span className="info-icon">ℹ️</span>
                        <div className="info-content">
                          <h4>What happens next?</h4>
                          <ul>
                            <li>Your request will be reviewed by administrators</li>
                            <li>You'll receive updates on the request status</li>
                            <li>Service will be scheduled based on priority and availability</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="preview-empty">
                    <div className="empty-icon">📝</div>
                    <p>Select an asset and issue type to see preview</p>
                  </div>
                )}
              </div>
            </div>

            {/* My Assets Summary */}
            <div className="assets-summary-card">
              <h3 className="summary-title">My Allocated Assets</h3>
              <div className="assets-list">
                {myAssets.map(asset => (
                  <div 
                    key={asset.allocationId}
                    className={`asset-summary-item ${selectedAsset === asset.allocationId.toString() ? 'selected' : ''}`}
                    onClick={() => setSelectedAsset(asset.allocationId.toString())}
                  >
                    <div className="asset-summary-header">
                      <span className="asset-icon">📦</span>
                      <div className="asset-summary-info">
                        <h4 className="asset-summary-name">{asset.assetName}</h4>
                        <p className="asset-summary-details">
                          {asset.assetNo} • {asset.categoryName}
                        </p>
                      </div>
                    </div>
                    <div className="asset-summary-meta">
                      <span className="allocation-date">
                        Allocated: {new Date(asset.allocatedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <div className="quick-actions-header">
          <h2 className="section-title">Related Actions</h2>
        </div>
        <div className="quick-actions-grid">
          <a href="/my-allocations" className="quick-action-card blue">
            <span className="action-icon">📦</span>
            <span className="action-text">My Assets</span>
          </a>
          <a href="/request-history" className="quick-action-card green">
            <span className="action-icon">📚</span>
            <span className="action-text">Request History</span>
          </a>
          <a href="/browse-assets" className="quick-action-card purple">
            <span className="action-icon">🔍</span>
            <span className="action-text">Browse Assets</span>
          </a>
          <a href="/raise-request" className="quick-action-card orange">
            <span className="action-icon">➕</span>
            <span className="action-text">Request New Asset</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequest;