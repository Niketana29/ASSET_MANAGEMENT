// Register.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PasswordStrengthBar from '../components/PasswordStrengthBar';
import { GENDER_OPTIONS, VALIDATION_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants';
import { validateEmail, validatePhone, validatePassword } from '../utils/constants';
import './Register.css';

const Register = () => {
  const { register, isAuthenticated, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    employeeName: '',
    email: '',
    contactNumber: '',
    gender: '',
    address: ''
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const validateField = (name, value) => {
    let errorMessage = '';

    switch (name) {
      case 'username':
        if (!value.trim()) {
          errorMessage = VALIDATION_MESSAGES.REQUIRED;
        } else if (value.length < 3 || value.length > 50) {
          errorMessage = 'Username must be between 3 and 50 characters';
        } else if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
          errorMessage = 'Username can only contain letters, numbers, dots, underscores, and hyphens';
        }
        break;

      case 'password':
        if (!value) {
          errorMessage = VALIDATION_MESSAGES.REQUIRED;
        } else if (!validatePassword(value)) {
          errorMessage = VALIDATION_MESSAGES.PASSWORD_WEAK;
        }
        break;

      case 'confirmPassword':
        if (!value) {
          errorMessage = VALIDATION_MESSAGES.REQUIRED;
        } else if (value !== formData.password) {
          errorMessage = 'Passwords do not match';
        }
        break;

      case 'employeeName':
        if (!value.trim()) {
          errorMessage = VALIDATION_MESSAGES.REQUIRED;
        } else if (value.length < 2 || value.length > 100) {
          errorMessage = 'Employee name must be between 2 and 100 characters';
        } else if (!/^[a-zA-Z\s.'-]+$/.test(value)) {
          errorMessage = 'Employee name can only contain letters, spaces, dots, apostrophes, and hyphens';
        }
        break;

      case 'email':
        if (!value.trim()) {
          errorMessage = VALIDATION_MESSAGES.REQUIRED;
        } else if (!validateEmail(value)) {
          errorMessage = VALIDATION_MESSAGES.EMAIL_INVALID;
        }
        break;

      case 'contactNumber':
        if (value && !validatePhone(value)) {
          errorMessage = VALIDATION_MESSAGES.PHONE_INVALID;
        }
        break;

      case 'gender':
        if (!value) {
          errorMessage = VALIDATION_MESSAGES.REQUIRED;
        }
        break;

      case 'address':
        if (value.length > 500) {
          errorMessage = 'Address must not exceed 500 characters';
        }
        break;

      default:
        break;
    }

    return errorMessage;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (error) {
      clearError();
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errorMessage = validateField(name, value);
    
    if (errorMessage) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: errorMessage
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach(field => {
      const errorMessage = validateField(field, formData[field]);
      if (errorMessage) {
        errors[field] = errorMessage;
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { confirmPassword, ...registrationData } = formData;
      const result = await register(registrationData);

      if (result.success) {
        setSuccessMessage(SUCCESS_MESSAGES.REGISTRATION_SUCCESS);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <div className="register-card">
          {/* Header */}
          <div className="register-header">
            <Link to="/" className="logo-link">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">AM</span>
              </div>
            </Link>
            <h1 className="register-title">Create Your Account</h1>
            <p className="register-subtitle">
              Join our asset management platform and streamline your workflow
            </p>
          </div>

          {successMessage && (
            <div className="success-message">
              <div className="flex items-center">
                <span className="success-icon">✅</span>
                <span>{successMessage}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              <div className="flex items-center">
                <span className="error-icon">❌</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-grid">

              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Username *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`form-input ${fieldErrors.username ? 'error' : ''}`}
                  placeholder="Enter your username"
                  autoComplete="username"
                />
                {fieldErrors.username && (
                  <p className="error-text">{fieldErrors.username}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="employeeName" className="form-label">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="employeeName"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`form-input ${fieldErrors.employeeName ? 'error' : ''}`}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
                {fieldErrors.employeeName && (
                  <p className="error-text">{fieldErrors.employeeName}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`form-input ${fieldErrors.email ? 'error' : ''}`}
                  placeholder="Enter your email address"
                  autoComplete="email"
                />
                {fieldErrors.email && (
                  <p className="error-text">{fieldErrors.email}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="contactNumber" className="form-label">
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`form-input ${fieldErrors.contactNumber ? 'error' : ''}`}
                  placeholder="Enter your contact number"
                  autoComplete="tel"
                />
                {fieldErrors.contactNumber && (
                  <p className="error-text">{fieldErrors.contactNumber}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="gender" className="form-label">
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`form-input ${fieldErrors.gender ? 'error' : ''}`}
                >
                  <option value="">Select gender</option>
                  {GENDER_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {fieldErrors.gender && (
                  <p className="error-text">{fieldErrors.gender}</p>
                )}
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  rows={3}
                  className={`form-input ${fieldErrors.address ? 'error' : ''}`}
                  placeholder="Enter your address (optional)"
                />
                {fieldErrors.address && (
                  <p className="error-text">{fieldErrors.address}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password *
                </label>
                <div className="password-input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`form-input ${fieldErrors.password ? 'error' : ''}`}
                    placeholder="Enter your password"
                    autoComplete="new-password"
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
                {fieldErrors.password && (
                  <p className="error-text">{fieldErrors.password}</p>
                )}
                <PasswordStrengthBar password={formData.password} showDetails={true} />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password *
                </label>
                <div className="password-input-group">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`form-input ${fieldErrors.confirmPassword ? 'error' : ''}`}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="password-toggle"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? '👁️' : '🔒'}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="error-text">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="terms-section">
              <p className="terms-text">
                By creating an account, you agree to our{' '}
                <a href="#" className="terms-link">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="terms-link">Privacy Policy</a>
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="submit-button"
            >
              {isSubmitting || isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <span className="button-arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="register-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="login-link">
                Login here
              </Link>
            </p>
          </div>
        </div>
        <div className="register-side-panel">
          <div className="side-panel-content">
            <div className="feature-highlight">
              <div className="feature-icon">⚡</div>
              <h3>Quick Setup</h3>
              <p>Get started in under 2 minutes with our streamlined registration process.</p>
            </div>
            
            <div className="feature-highlight">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Your data is protected with enterprise-grade security and encryption.</p>
            </div>
            
            <div className="feature-highlight">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Access your assets from anywhere with our responsive design.</p>
            </div>

            <div className="testimonial">
              <blockquote>
                "The auto-approval system has saved us countless hours in asset management."
              </blockquote>
              <cite>— IT Manager, TechCorp</cite>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;