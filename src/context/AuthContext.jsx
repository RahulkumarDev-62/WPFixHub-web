import React, { createContext, useState, useEffect } from 'react'
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '../utils/helpers'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedUser = getLocalStorage('user')
    const storedAdmin = getLocalStorage('admin')

    if (storedUser) {
      setUser(storedUser)
    }
    if (storedAdmin) {
      setAdmin(storedAdmin)
    }
    setLoading(false)
  }, [])

  // User Login
  const loginUser = (userData) => {
    try {
      setUser(userData)
      setLocalStorage('user', userData)
      setError(null)
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }

  // User Logout
  const logoutUser = () => {
    setUser(null)
    removeLocalStorage('user')
    removeLocalStorage('userToken')
  }

  // Admin Login
  const loginAdmin = (adminData) => {
    try {
      setAdmin(adminData)
      setLocalStorage('admin', adminData)
      setLocalStorage('adminToken', adminData.token)
      setError(null)
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }

  // Admin Logout
  const logoutAdmin = () => {
    setAdmin(null)
    removeLocalStorage('admin')
    removeLocalStorage('adminToken')
  }

  // Update User Profile
  const updateUserProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData }
    setUser(updatedUser)
    setLocalStorage('user', updatedUser)
  }

  // Check if user is authenticated
  const isUserAuthenticated = () => !!user

  // Check if admin is authenticated
  const isAdminAuthenticated = () => !!admin

  const value = {
    user,
    admin,
    loading,
    error,
    loginUser,
    logoutUser,
    loginAdmin,
    logoutAdmin,
    updateUserProfile,
    isUserAuthenticated,
    isAdminAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom Hook to use AuthContext
export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
