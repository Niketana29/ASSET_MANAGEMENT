import { ERROR_MESSAGES } from './constants';

class ApiErrorHandler {
  static handleError(error) {
    console.error('API Error:', error);

    if (!error.response) {
      return {
        message: ERROR_MESSAGES.NETWORK_ERROR,
        status: 0,
        details: []
      };
    }

    const { status, data } = error.response;

    switch (status) {
      case 400:
        return {
          message: data.message || ERROR_MESSAGES.VALIDATION_ERROR,
          status,
          details: data.details || []
        };

      case 401:
        return {
          message: data.message || ERROR_MESSAGES.UNAUTHORIZED,
          status,
          details: []
        };

      case 403:
        return {
          message: data.message || ERROR_MESSAGES.FORBIDDEN,
          status,
          details: []
        };

      case 404:
        return {
          message: data.message || ERROR_MESSAGES.NOT_FOUND,
          status,
          details: []
        };

      case 409:
        return {
          message: data.message || 'Resource already exists',
          status,
          details: []
        };

      case 422:
        return {
          message: data.message || ERROR_MESSAGES.VALIDATION_ERROR,
          status,
          details: data.details || []
        };

      case 500:
        return {
          message: data.message || ERROR_MESSAGES.SERVER_ERROR,
          status,
          details: []
        };

      default:
        return {
          message: data.message || ERROR_MESSAGES.UNKNOWN_ERROR,
          status,
          details: []
        };
    }
  }

  static formatValidationErrors(details) {
    if (!details || !Array.isArray(details)) {
      return [];
    }

    return details.map(detail => ({
      field: detail.field || 'general',
      message: detail.defaultMessage || detail
    }));
  }

  static showNotification(error, notificationSystem) {
    const handledError = this.handleError(error);
    
    if (notificationSystem) {
      notificationSystem.addNotification({
        message: handledError.message,
        level: 'error',
        position: 'tr',
        autoDismiss: 5
      });
    }

    return handledError;
  }

  static getFieldErrors(error) {
    const handledError = this.handleError(error);
    const fieldErrors = {};

    if (handledError.details && Array.isArray(handledError.details)) {
      handledError.details.forEach(detail => {
        if (typeof detail === 'object' && detail.field) {
          fieldErrors[detail.field] = detail.message;
        }
      });
    }

    return fieldErrors;
  }

  static isValidationError(error) {
    return error.response && (error.response.status === 400 || error.response.status === 422);
  }

  static isAuthError(error) {
    return error.response && (error.response.status === 401 || error.response.status === 403);
  }

  static isNetworkError(error) {
    return !error.response;
  }

  static getErrorMessage(error, defaultMessage = ERROR_MESSAGES.UNKNOWN_ERROR) {
    const handledError = this.handleError(error);
    return handledError.message || defaultMessage;
  }
}

export default ApiErrorHandler;

// Additional utility functions
export const formatDate = (date, format = 'MMM DD, YYYY') => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';

  const options = {};
  
  switch (format) {
    case 'MMM DD, YYYY':
      options.year = 'numeric';
      options.month = 'short';
      options.day = '2-digit';
      break;
    case 'MMM DD, YYYY HH:mm':
      options.year = 'numeric';
      options.month = 'short';
      options.day = '2-digit';
      options.hour = '2-digit';
      options.minute = '2-digit';
      break;
    case 'YYYY-MM-DD':
      return dateObj.toISOString().split('T')[0];
    default:
      options.year = 'numeric';
      options.month = 'short';
      options.day = '2-digit';
  }

  return dateObj.toLocaleDateString('en-US', options);
};

export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const getStatusBadgeClass = (status) => {
  const baseClass = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  switch (status?.toLowerCase()) {
    case 'approved':
    case 'completed':
    case 'verified':
    case 'available':
      return `${baseClass} bg-green-100 text-green-800`;
    case 'pending':
    case 'maintenance':
      return `${baseClass} bg-yellow-100 text-yellow-800`;
    case 'requested':
    case 'in_progress':
    case 'allocated':
      return `${baseClass} bg-blue-100 text-blue-800`;
    case 'rejected':
    case 'retired':
      return `${baseClass} bg-red-100 text-red-800`;
    case 'returned':
      return `${baseClass} bg-gray-100 text-gray-800`;
    default:
      return `${baseClass} bg-gray-100 text-gray-800`;
  }
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[+]?[0-9\s()-]{10,15}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const getPasswordStrength = (password) => {
  let strength = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password)
  };

  strength = Object.values(checks).filter(Boolean).length;

  return {
    score: strength,
    label: strength < 3 ? 'Weak' : strength < 4 ? 'Medium' : 'Strong',
    color: strength < 3 ? 'red' : strength < 4 ? 'yellow' : 'green',
    checks
  };
};