import { format } from 'date-fns'

// Format Currency
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

// Format Date
export const formatDate = (date, formatStr = 'dd MMM yyyy') => {
  return format(new Date(date), formatStr)
}

// Format Time
export const formatTime = (date) => {
  return format(new Date(date), 'hh:mm a')
}

// Get Initials from Name
export const getInitials = (name) => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

// Truncate Text
export const truncateText = (text, length = 50) => {
  return text.length > length ? text.substring(0, length) + '...' : text
}

// Generate Random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

// Get Status Color
export const getStatusColor = (status) => {
  const colors = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Completed': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
    'Approved': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Confirmed': 'bg-green-100 text-green-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// Calculate Days Remaining
export const daysRemaining = (date) => {
  const today = new Date()
  const targetDate = new Date(date)
  const difference = targetDate - today
  return Math.ceil(difference / (1000 * 60 * 60 * 24))
}

// Debounce Function
export const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Local Storage Helpers
export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const getLocalStorage = (key) => {
  const item = localStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

export const removeLocalStorage = (key) => {
  localStorage.removeItem(key)
}
