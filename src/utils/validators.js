// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password validation
export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 number, 1 special character
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

// Phone validation
export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

// Name validation
export const validateName = (name) => {
  return name && name.trim().length >= 2
}

// URL validation
export const validateURL = (url) => {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

// Number validation
export const validateNumber = (num) => {
  return !isNaN(num) && num !== ''
}

// Zip code validation
export const validateZipCode = (zipCode) => {
  const zipRegex = /^[0-9]{6}$/
  return zipRegex.test(zipCode.replace(/\D/g, ''))
}

// Credit card validation (Luhn algorithm)
export const validateCreditCard = (cardNumber) => {
  const sanitized = cardNumber.replace(/\D/g, '')
  if (sanitized.length < 13 || sanitized.length > 19) return false

  let sum = 0
  let isEven = false

  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized[i], 10)

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

// Username validation
export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}

// Strong password check
export const isStrongPassword = (password) => {
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[@$!%*?&]/.test(password)
  const isLongEnough = password.length >= 8

  return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough
}

// Validate form data
export const validateFormData = (data, rules) => {
  const errors = {}

  Object.keys(rules).forEach((field) => {
    const rule = rules[field]
    const value = data[field]

    if (rule.required && (!value || value.trim() === '')) {
      errors[field] = `${rule.label || field} is required`
    } else if (rule.type === 'email' && value && !validateEmail(value)) {
      errors[field] = 'Invalid email address'
    } else if (rule.type === 'phone' && value && !validatePhone(value)) {
      errors[field] = 'Invalid phone number'
    } else if (rule.type === 'url' && value && !validateURL(value)) {
      errors[field] = 'Invalid URL'
    } else if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `${rule.label || field} must be at least ${rule.minLength} characters`
    } else if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = `${rule.label || field} must not exceed ${rule.maxLength} characters`
    } else if (rule.pattern && value && !rule.pattern.test(value)) {
      errors[field] = rule.patternMessage || `${rule.label || field} is invalid`
    }
  })

  return errors
}

// Validate password match
export const validatePasswordMatch = (password, confirmPassword) => {
  return password === confirmPassword
}

// Validate age
export const validateAge = (birthDate, minAge = 18) => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age >= minAge
}

// Validate date range
export const validateDateRange = (startDate, endDate) => {
  return new Date(startDate) <= new Date(endDate)
}

// Validate file type
export const validateFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type)
}

// Validate file size
export const validateFileSize = (file, maxSizeInMB) => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024
  return file.size <= maxSizeInBytes
}
