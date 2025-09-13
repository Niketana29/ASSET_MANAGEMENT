export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8092/api';

export const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  USER: 'ROLE_USER'
};

export const ASSET_STATUS = {
  AVAILABLE: 'AVAILABLE',
  ALLOCATED: 'ALLOCATED',
  MAINTENANCE: 'MAINTENANCE',
  RETIRED: 'RETIRED'
};

export const ALLOCATION_STATUS = {
  REQUESTED: 'REQUESTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  RETURNED: 'RETURNED'
};

export const SERVICE_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED'
};

export const AUDIT_STATUS = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED'
};

export const ISSUE_TYPES = {
  MALFUNCTION: 'MALFUNCTION',
  REPAIR: 'REPAIR',
  MAINTENANCE: 'MAINTENANCE',
  OTHER: 'OTHER'
};

export const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' }
];

export const STATUS_COLORS = {
  REQUESTED: '#ffa500',
  APPROVED: '#28a745',
  REJECTED: '#dc3545',
  RETURNED: '#6c757d',
  PENDING: '#ffc107',
  IN_PROGRESS: '#17a2b8',
  COMPLETED: '#28a745',
  VERIFIED: '#28a745',
  AVAILABLE: '#28a745',
  ALLOCATED: '#17a2b8',
  MAINTENANCE: '#ffc107',
  RETIRED: '#6c757d'
};

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_WEAK: 'Password must contain at least 8 characters with uppercase, lowercase, number, and special character',
  PHONE_INVALID: 'Please enter a valid phone number',
  MIN_LENGTH: (field, min) => `${field} must be at least ${min} characters long`,
  MAX_LENGTH: (field, max) => `${field} must not exceed ${max} characters`,
  POSITIVE_NUMBER: 'Value must be a positive number',
  FUTURE_DATE: 'Date must be in the future',
  PAST_DATE: 'Date cannot be in the future'
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful! Redirecting...',
  REGISTRATION_SUCCESS: 'Registration successful! You can now login.',
  ASSET_REQUEST_SUCCESS: 'Asset request submitted successfully!',
  ASSET_REQUEST_AUTO_APPROVED: 'Asset request auto-approved and allocated!',
  ASSET_CREATED: 'Asset created successfully!',
  ASSET_UPDATED: 'Asset updated successfully!',
  ASSET_DELETED: 'Asset deleted successfully!',
  CATEGORY_CREATED: 'Category created successfully!',
  CATEGORY_UPDATED: 'Category updated successfully!',
  CATEGORY_DELETED: 'Category deleted successfully!',
  EMPLOYEE_CREATED: 'Employee created successfully!',
  EMPLOYEE_UPDATED: 'Employee updated successfully!',
  EMPLOYEE_DELETED: 'Employee deleted successfully!',
  ALLOCATION_APPROVED: 'Asset allocation approved successfully!',
  ALLOCATION_REJECTED: 'Asset allocation rejected.',
  ASSET_RETURNED: 'Asset returned successfully!',
  SERVICE_REQUEST_CREATED: 'Service request created successfully!',
  SERVICE_REQUEST_UPDATED: 'Service request status updated successfully!',
  AUDIT_REQUEST_CREATED: 'Audit requests created for all employees!',
  AUDIT_VERIFIED: 'Audit request verified successfully!',
  AUDIT_REJECTED: 'Audit request rejected.'
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  FORBIDDEN: 'Access denied. Insufficient permissions.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check the form for errors.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
  LOGIN_FAILED: 'Invalid credentials. Please try again.',
  REGISTRATION_FAILED: 'Registration failed. Please try again.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.'
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ADMIN_LOGIN: '/admin-login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ADMIN_DASHBOARD: '/admin-dashboard',
  USER_DASHBOARD: '/user-dashboard',
  BROWSE_ASSETS: '/browse-assets',
  MY_ALLOCATIONS: '/my-allocations',
  RAISE_REQUEST: '/raise-request',
  SERVICE_REQUEST: '/service-request',
  REQUEST_HISTORY: '/request-history',
  MANAGE_ASSETS: '/admin/assets',
  MANAGE_CATEGORIES: '/admin/categories',
  MANAGE_EMPLOYEES: '/admin/employees',
  AUDIT_REQUESTS: '/admin/audit-requests',
  SERVICE_REQUESTS: '/admin/service-requests',
  REPORTS: '/admin/reports',
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/unauthorized',
  SERVER_ERROR: '/server-error'
};

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language'
};

export const DEBOUNCE_DELAY = 300;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
  MAX_VISIBLE_PAGES: 5
};

export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm',
  INPUT: 'YYYY-MM-DD',
  API: 'YYYY-MM-DDTHH:mm:ss'
};


export function getPasswordStrength(password) {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  const score = Object.values(checks).reduce((acc, curr) => acc + (curr ? 1 : 0), 0);

  return { score, checks };
};

// Email validation
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Phone number validation (simple, 10-digit)
export function validatePhone(phone) {
  const re = /^\d{10}$/;
  return re.test(phone);
};

// Password validation (at least 8 chars, uppercase, lowercase, number, special)
export function validatePassword(password) {
  return (
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[@$!%*?&]/.test(password) &&
    password.length >= 8
  );
};

// Format a number as currency (USD by default)
export function formatCurrency(amount, currency = 'USD') {
  if (typeof amount !== 'number') return amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};

export function formatDate(dateString, format = 'MMM DD, YYYY') {
  const date = new Date(dateString);
  const options = {};

  if (format.includes('MMM')) options.month = 'short';
  if (format.includes('DD')) options.day = '2-digit';
  if (format.includes('YYYY')) options.year = 'numeric';
  if (format.includes('HH')) options.hour = '2-digit';
  if (format.includes('mm')) options.minute = '2-digit';

  return date.toLocaleString('en-US', options);
};

export function getStatusBadgeClass(status) {
  switch (status) {
    case 'REQUESTED':
    case 'PENDING':
      return 'status-badge pending';
    case 'APPROVED':
    case 'COMPLETED':
    case 'VERIFIED':
      return 'status-badge success';
    case 'REJECTED':
      return 'status-badge rejected';
    case 'RETURNED':
      return 'status-badge returned';
    case 'IN_PROGRESS':
      return 'status-badge in-progress';
    case 'AVAILABLE':
      return 'status-badge available';
    case 'ALLOCATED':
      return 'status-badge allocated';
    case 'MAINTENANCE':
      return 'status-badge maintenance';
    case 'RETIRED':
      return 'status-badge retired';
    default:
      return 'status-badge unknown';
  }
};




export const ASSET_CATEGORIES = {
  AUTO_APPROVED: [
    'Stationery',
    'Basic Peripherals', 
    'Printing Equipment',
    'Office Supplies'
  ],
  ADMIN_APPROVAL: [
    'Laptops',
    'Desktop Computers',
    'Conference Equipment',
    'Furniture',
    'Mobile Devices',
    'Networking Equipment'
  ]
};