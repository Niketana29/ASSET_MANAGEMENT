import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AssetAllocationService from '../../services/AssetAllocationService';
import CategoryService from '../../services/CategoryService';
import { useAuth } from '../../context/AuthContext';
import { VALIDATION_MESSAGES } from '../../utils/constants';

const RaiseRequest = () => {
  const { getEmployeeId } = useAuth();
  
  const [formData, setFormData] = useState({
    assetName: '',
    categoryId: '',
    requestReason: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  
  // Preview state
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    // Find and set selected category when categoryId changes
    if (formData.categoryId) {
      const category = categories.find(cat => cat.categoryId.toString() === formData.categoryId);
      setSelectedCategory(category);
    } else {
      setSelectedCategory(null);
    }
  }, [formData.categoryId, categories]);

  const loadCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const categoriesData = await CategoryService.getAllCategories();
      setCategories(categoriesData);
    } catch (err) {
      setError('Failed to load categories');
      console.error('Error loading categories:', err);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.assetName.trim()) {
      errors.assetName = VALIDATION_MESSAGES.REQUIRED;
    } else if (formData.assetName.trim().length < 2) {
      errors.assetName = VALIDATION_MESSAGES.MIN_LENGTH('Asset name', 2);
    } else if (formData.assetName.trim().length > 200) {
      errors.assetName = VALIDATION_MESSAGES.MAX_LENGTH('Asset name', 200);
    }

    if (!formData.categoryId) {
      errors.categoryId = VALIDATION_MESSAGES.REQUIRED;
    }

    if (formData.requestReason && formData.requestReason.length > 500) {
      errors.requestReason = VALIDATION_MESSAGES.MAX_LENGTH('Request reason', 500);
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

    setIsLoading(true);
    setError('');

    try {
      const requestData = {
        employeeId: getEmployeeId(),
        assetName: formData.assetName.trim(),
        requestReason: formData.requestReason.trim() || 'Asset needed for work',
        categoryId: parseInt(formData.categoryId)
      };

      const response = await AssetAllocationService.requestAsset(requestData);
      
      if (response.isAutoApproved) {
        setSuccessMessage(`🎉 Great news! Your request for "${formData.assetName}" has been auto-approved and allocated to you instantly!`);
      } else {
        setSuccessMessage(`✅ Your request for "${formData.assetName}" has been submitted successfully and is pending admin approval.`);
      }

      // Reset form
      setFormData({
        assetName: '',
        categoryId: '',
        requestReason: ''
      });
      setSelectedCategory(null);
      
      // Clear success message after 7 seconds
      setTimeout(() => setSuccessMessage(''), 7000);

    } catch (err) {
      setError(err.message || 'Failed to submit asset request');
      console.error('Error submitting request:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      assetName: '',
      categoryId: '',
      requestReason: ''
    });
    setSelectedCategory(null);
    setValidationErrors({});
    setError('');
  };

  if (isLoadingCategories) {
    return (
      <div className="raise-request-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="raise-request-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Request New Asset</h1>
        <p className="page-subtitle">
          Submit a request for any asset you need for your work
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

      <div className="request-content">
        {/* Request Form */}
        <div className="request-form-section">
          <div className="form-card">
            <div className="form-header">
              <h2 className="form-title">Asset Request Details</h2>
              <p className="form-description">
                Fill out the form below to request an asset. Some categories are auto-approved!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="request-form">
              {/* Asset Name */}
              <div className="form-group">
                <label htmlFor="assetName" className="form-label">
                  Asset Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="assetName"
                  name="assetName"
                  value={formData.assetName}
                  onChange={handleInputChange}
                  placeholder="e.g., MacBook Pro, Office Chair, Printer..."
                  className={`form-input ${validationErrors.assetName ? 'error' : ''}`}
                  maxLength={200}
                />
                {validationErrors.assetName && (
                  <span className="error-text">{validationErrors.assetName}</span>
                )}
                <div className="input-help">
                  Be specific about the asset you need (brand, model, specifications if applicable)
                </div>
              </div>

              {/* Category */}
              <div className="form-group">
                <label htmlFor="categoryId" className="form-label">
                  Category <span className="required">*</span>
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className={`form-select ${validationErrors.categoryId ? 'error' : ''}`}
                >
                  <option value="">Select a category...</option>
                  {categories.map(category => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.categoryName} 
                      {category.isAutoApproved && ' ⚡ (Auto-approved)'}
                    </option>
                  ))}
                </select>
                {validationErrors.categoryId && (
                  <span className="error-text">{validationErrors.categoryId}</span>
                )}
                <div className="input-help">
                  Choose the category that best fits your requested asset
                </div>
              </div>

              {/* Request Reason */}
              <div className="form-group">
                <label htmlFor="requestReason" className="form-label">
                  Reason for Request <span className="optional">(Optional)</span>
                </label>
                <textarea
                  id="requestReason"
                  name="requestReason"
                  value={formData.requestReason}
                  onChange={handleInputChange}
                  placeholder="Please explain why you need this asset, what you'll use it for, or any other relevant details..."
                  className={`form-textarea ${validationErrors.requestReason ? 'error' : ''}`}
                  rows={4}
                  maxLength={500}
                />
                {validationErrors.requestReason && (
                  <span className="error-text">{validationErrors.requestReason}</span>
                )}
                <div className="character-count">
                  {formData.requestReason.length}/500 characters
                </div>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button
                  type="button"
                  onClick={clearForm}
                  className="clear-button"
                  disabled={isLoading}
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isLoading || !formData.assetName.trim() || !formData.categoryId}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner-small"></div>
                      Submitting...
                    </>
                  ) : selectedCategory?.isAutoApproved ? (
                    <>
                      ⚡ Submit & Auto-Approve
                    </>
                  ) : (
                    <>
                      📋 Submit Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Request Preview */}
        <div className="request-preview-section">
          <div className="preview-card">
            <div className="preview-header">
              <h3 className="preview-title">Request Preview</h3>
              <div className="preview-icon">
                {selectedCategory?.isAutoApproved ? '⚡' : '📋'}
              </div>
            </div>

            <div className="preview-content">
              {formData.assetName || formData.categoryId || formData.requestReason ? (
                <>
                  <div className="preview-item">
                    <span className="preview-label">Asset Name:</span>
                    <span className="preview-value">
                      {formData.assetName || <em>Not specified</em>}
                    </span>
                  </div>

                  {selectedCategory && (
                    <div className="preview-item">
                      <span className="preview-label">Category:</span>
                      <span className="preview-value">
                        {selectedCategory.categoryName}
                        {selectedCategory.isAutoApproved && (
                          <span className="auto-approved-tag">Auto-approved</span>
                        )}
                      </span>
                    </div>
                  )}

                  {formData.requestReason && (
                    <div className="preview-item">
                      <span className="preview-label">Reason:</span>
                      <span className="preview-value">{formData.requestReason}</span>
                    </div>
                  )}

                  {/* Approval Info */}
                  <div className="approval-info">
                    {selectedCategory?.isAutoApproved ? (
                      <div className="auto-approval-info">
                        <span className="info-icon">⚡</span>
                        <div className="info-content">
                          <h4>Instant Approval</h4>
                          <p>This request will be automatically approved and the asset will be allocated to you immediately.</p>
                        </div>
                      </div>
                    ) : selectedCategory ? (
                      <div className="manual-approval-info">
                        <span className="info-icon">👤</span>
                        <div className="info-content">
                          <h4>Admin Approval Required</h4>
                          <p>This request will be sent to administrators for review and approval.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="no-category-info">
                        <span className="info-icon">ℹ️</span>
                        <div className="info-content">
                          <h4>Select a Category</h4>
                          <p>Choose a category to see approval information.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="preview-empty">
                  <div className="empty-icon">📝</div>
                  <p>Fill out the form to see a preview of your request</p>
                </div>
              )}
            </div>
          </div>

          {/* Category Information */}
          <div className="category-info-card">
            <h3 className="info-title">Category Information</h3>
            <div className="category-grid">
              <div className="category-type">
                <h4 className="type-title">
                  <span className="type-icon">⚡</span>
                  Auto-approved Categories
                </h4>
                <div className="category-list">
                  {categories
                    .filter(cat => cat.isAutoApproved)
                    .map(cat => (
                      <span key={cat.categoryId} className="category-tag auto-approved">
                        {cat.categoryName}
                      </span>
                    ))}
                </div>
                <p className="type-description">
                  Requests in these categories are approved instantly
                </p>
              </div>

              <div className="category-type">
                <h4 className="type-title">
                  <span className="type-icon">👤</span>
                  Admin-approval Categories
                </h4>
                <div className="category-list">
                  {categories
                    .filter(cat => !cat.isAutoApproved)
                    .map(cat => (
                      <span key={cat.categoryId} className="category-tag admin-approval">
                        {cat.categoryName}
                      </span>
                    ))}
                </div>
                <p className="type-description">
                  Requests in these categories require admin approval
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <div className="quick-actions-header">
          <h2 className="section-title">Related Actions</h2>
        </div>
        <div className="quick-actions-grid">
          <Link to="/browse-assets" className="quick-action-card blue">
            <span className="action-icon">🔍</span>
            <span className="action-text">Browse Available Assets</span>
          </Link>
          <Link to="/my-allocations" className="quick-action-card green">
            <span className="action-icon">📦</span>
            <span className="action-text">My Allocated Assets</span>
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

export default RaiseRequest;