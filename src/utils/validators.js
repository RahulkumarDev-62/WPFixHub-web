// Email Validation
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Password Validation (min 8 chars, 1 uppercase, 1 number, 1 special char)
export const validatePassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return regex.test(password)
}

// Phone Number Validation (10 digits)
export const validatePhone = (phone) => {
  const regex = /^[0-9]{10}$/
  return regex.test(phone)
}

// Name Validation (min 2 chars, no numbers)
export const validateName = (name) => {
  const regex = /^[a-zA-Z\s]{2,}$/
  return regex.test(name)
}

// URL Validation
export const validateURL = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Price Validation (positive number)
export const validatePrice = (price) => {
  return !isNaN(price) && parseFloat(price) > 0
}

// Date Validation (future date)
export const validateFutureDate = (date) => {
  return new Date(date) > new Date()
}

// File Size Validation (max 5MB)
export const validateFileSize = (file, maxSizeMB = 5) => {
  return file.size <= maxSizeMB * 1024 * 1024
}

// File Type Validation
export const validateFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type)
}
