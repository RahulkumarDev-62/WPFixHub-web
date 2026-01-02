// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
export const API_TIMEOUT = 30000

// Authentication
export const ADMIN_CREDENTIALS = {
  email: 'rahul@wp-fixhub.com',
  password: 'Divya@Rahul62',
}

// Order Status
export const ORDER_STATUS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  FAILED: 'Failed',
}

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

// Appointment Status
export const APPOINTMENT_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  RESCHEDULED: 'Rescheduled',
}

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
}

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
}

// Service Categories
export const SERVICE_CATEGORIES = [
  'WordPress Fixes',
  'Digital Marketing',
  'Web Development',
  'Security Solutions',
  'UI/UX Design',
  'Performance Optimization',
]

// Payment Methods
export const PAYMENT_METHODS = {
  RAZORPAY: 'Razorpay',
  PHONPE: 'PhonePe',
  BANK_TRANSFER: 'Bank Transfer',
  WALLET: 'Wallet',
}

// Tax Rate
export const TAX_RATE = 18 // GST in India

// Currency
export const CURRENCY = {
  CODE: 'INR',
  SYMBOL: '₹',
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
}

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  ISO: 'YYYY-MM-DD',
  FULL: 'DD MMM YYYY',
}

// Time Formats
export const TIME_FORMATS = {
  DISPLAY: 'HH:mm',
  FULL: 'HH:mm:ss',
}

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_PATTERN: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PHONE_PATTERN: /^[0-9]{10}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
}

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_PASSWORD: 'Password must be at least 8 characters with uppercase, number, and special character',
  PASSWORD_MISMATCH: 'Passwords do not match',
  INVALID_URL: 'Please enter a valid URL',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit',
  INVALID_FILE_TYPE: 'Invalid file type',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'Resource not found',
}

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logout successful!',
  REGISTRATION_SUCCESS: 'Registration successful!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  ORDER_PLACED: 'Order placed successfully!',
  BOOKING_CONFIRMED: 'Booking confirmed successfully!',
  APPOINTMENT_SCHEDULED: 'Appointment scheduled successfully!',
  PAYMENT_SUCCESS: 'Payment successful!',
}

// Feature Flags
export const FEATURES = {
  ENABLE_RAZORPAY: true,
  ENABLE_PHONPE: true,
  ENABLE_BOOKING: true,
  ENABLE_APPOINTMENTS: true,
  ENABLE_AI_CHAT: true,
}

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
}

// Animation Durations (in ms)
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
}

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile/update',
    CHANGE_PASSWORD: '/users/password/change',
  },
  ORDERS: {
    CREATE: '/orders/create',
    GET_ALL: '/orders',
    GET_ONE: '/orders/:id',
    UPDATE: '/orders/:id/update',
    CANCEL: '/orders/:id/cancel',
  },
  PAYMENTS: {
    CREATE: '/payments/create',
    VERIFY: '/payments/verify',
    GET_ALL: '/payments',
  },
}

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'user',
  ADMIN: 'admin',
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  THEME: 'theme',
  LANGUAGE: 'language',
}

// Default Values
export const DEFAULT_VALUES = {
  PAGE_SIZE: 10,
  TIMEOUT: 5000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
}
