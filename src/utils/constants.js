// Admin Credentials (Hardcoded for security - in production use Supabase)
export const ADMIN_CREDENTIALS = {
  email: 'rahul@wp-fixhub.com',
  password: 'Divya@Rahul62',
}

// Order Status Options
export const ORDER_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

// Booking Status Options
export const BOOKING_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
}

// Appointment Status Options
export const APPOINTMENT_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  COMPLETED: 'Completed',
}

// Payment Status Options
export const PAYMENT_STATUS = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
}

// Payment Methods
export const PAYMENT_METHODS = {
  RAZORPAY: 'Razorpay',
  PHONPE: 'PhonePe',
}

// Color Palette
export const COLORS = {
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  accent: '#EC4899',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  dark: '#1F2937',
  light: '#F9FAFB',
}

// API Endpoints (if using external APIs)
export const API_ENDPOINTS = {
  RAZORPAY_CREATE_ORDER: 'https://api.razorpay.com/v1/orders',
  PHONPE_CREATE_ORDER: 'https://api.phonepe.com/v1/orders',
}

// Pagination
export const ITEMS_PER_PAGE = 10

// Time Slots for Appointments
export const TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
]
