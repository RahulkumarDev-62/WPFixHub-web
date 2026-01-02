import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

const ProtectedRoute = ({ children, requiredRole = 'user' }) => {
  const { user, admin, loading, isUserAuthenticated, isAdminAuthenticated } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  // Check if user route is protected
  if (requiredRole === 'user') {
    if (!isUserAuthenticated()) {
      return <Navigate to="/user/login" replace />
    }
    return children
  }

  // Check if admin route is protected
  if (requiredRole === 'admin') {
    if (!isAdminAuthenticated()) {
      return <Navigate to="/admin/login" replace />
    }
    return children
  }

  return children
}

export default ProtectedRoute
