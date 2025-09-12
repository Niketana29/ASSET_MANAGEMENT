import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';

const AdminLogin = () => {
  const { login, isAuthenticated, isLoading, error, clearError, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated && user?.role === ROLES.ADMIN) {
      navigate(from, { replace: true });
    } else if (isAuthenticated && user?.role === ROLES.USER) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate, from]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(formData);

      if (result.success) {
        if (result.data.role === ROLES.ADMIN) {
          navigate(from, { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err) {
      console.error('Admin login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container admin-login">
      <div className="login-wrapper">
        {/* Main Login Card */}
        <div className="login-card admin-card">
          {/* Header */}
          <div className="login-header">
            <Link to="/" className="logo-link">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">AM</span>
              </div>
            </Link>
            <h1 className="login-title">Administrator Login</h1>
            <p className="login-subtitle">
              Access the administrative dashboard
            </p>
          </div>

          {/* Security Notice */}
          <div className="security-notice">
            <div className="flex items-start">
              <span className="text-yellow-500 text-lg mr-2">⚠️</span>
              <div className="text-sm">
                <strong>Restricted Access</strong>
                <p className="text-gray-600 mt-1">
                  This area is restricted to authorized administrators only.
                  All access attempts are logged and monitored.
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <div className="flex items-center">
                <span className="error-icon">❌</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Administrator Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter administrator username"
                autoComplete="username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="password-input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter administrator password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="password-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️' : '🔒'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading || !formData.username.trim() || !formData.password}
              className="submit-button admin-button"
            >
              {isSubmitting || isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <span>🛡️ Admin Login</span>
                  <span className="button-arrow">→</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span>or</span>
          </div>

          {/* User Login Link */}
          <Link to="/login" className="user-login-link">
            <span className="mr-2">👥</span>
            Login as Employee
          </Link>

          {/* Footer */}
          <div className="login-footer">
            <p className="text-sm text-gray-500">
              Need help? Contact system administrator
            </p>
          </div>
        </div>

        {/* Side Panel */}
        <div className="login-side-panel admin-side-panel">
          <div className="side-panel-content">
            <h2>Administrator Portal</h2>
            <p>Manage your organization's assets, users, and system configuration.</p>

            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">👥</span>
                <span>Manage employees and users</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📦</span>
                <span>Control asset inventory</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✅</span>
                <span>Approve/reject requests</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Generate detailed reports</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔧</span>
                <span>System configuration</span>
              </div>
            </div>

            <div className="admin-warning">
              <h3>Security Reminder</h3>
              <ul className="text-sm space-y-1">
                <li>• Never share administrator credentials</li>
                <li>• Always log out when finished</li>
                <li>• Report suspicious activity immediately</li>
                <li>• Use secure networks only</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;