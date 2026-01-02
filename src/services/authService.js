import { supabase } from './supabaseClient'
import { ADMIN_CREDENTIALS } from '../utils/constants'

// ==================== USER AUTHENTICATION ====================

// User Registration
export const registerUser = async (email, password, name, phone) => {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError

    // Create user profile in database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email,
          name,
          phone,
          profileImage: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          createdAt: new Date(),
        },
      ])
      .select()

    if (userError) throw userError

    return {
      success: true,
      user: userData[0],
      message: 'Registration successful! Please verify your email.',
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

// User Login
export const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    // Fetch user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (userError) throw userError

    return {
      success: true,
      user: {
        ...userData,
        token: data.session.access_token,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

// User Logout
export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Update User Profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(profileData)
      .eq('id', userId)
      .select()

    if (error) throw error

    return {
      success: true,
      user: data[0],
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

// Change Password
export const changePassword = async (newPassword) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error

    return {
      success: true,
      message: 'Password changed successfully',
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

// ==================== ADMIN AUTHENTICATION ====================

// Admin Login (Hardcoded credentials for security)
export const loginAdmin = async (email, password) => {
  try {
    // Verify credentials
    if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
      throw new Error('Invalid admin credentials')
    }

    // Create admin session
    const adminData = {
      id: 'admin_001',
      email: ADMIN_CREDENTIALS.email,
      role: 'admin',
      token: `admin_token_${Date.now()}`,
      loginTime: new Date(),
    }

    return {
      success: true,
      admin: adminData,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

// Admin Logout
export const logoutAdmin = async () => {
  return {
    success: true,
    message: 'Admin logged out successfully',
  }
}

// Verify Admin Token
export const verifyAdminToken = (token) => {
  return token && token.startsWith('admin_token_')
}

// Get Current User
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return { success: true, user: data.user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Reset Password
export const resetPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
    return {
      success: true,
      message: 'Password reset email sent',
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}
