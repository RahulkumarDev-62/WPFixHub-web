import { supabase } from './supabaseClient'

// ==================== SERVICE MANAGEMENT ====================

// Get All Services
export const getAllServices = async () => {
  try {
    const { data, error } = await supabase.from('services').select('*').order('createdAt', {
      ascending: false,
    })

    if (error) throw error
    return { success: true, services: data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Create Service
export const createService = async (serviceData) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .insert([
        {
          ...serviceData,
          createdAt: new Date(),
        },
      ])
      .select()

    if (error) throw error
    return { success: true, service: data[0] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Update Service
export const updateService = async (serviceId, serviceData) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .update(serviceData)
      .eq('id', serviceId)
      .select()

    if (error) throw error
    return { success: true, service: data[0] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Delete Service
export const deleteService = async (serviceId) => {
  try {
    const { error } = await supabase.from('services').delete().eq('id', serviceId)

    if (error) throw error
    return { success: true, message: 'Service deleted' }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ==================== TEAM MANAGEMENT ====================

// Get All Team Members
export const getAllTeamMembers = async () => {
  try {
    const { data, error } = await supabase.from('team_members').select('*').order('createdAt', {
      ascending: false,
    })

    if (error) throw error
    return { success: true, teamMembers: data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Create Team Member
export const createTeamMember = async (memberData) => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .insert([
        {
          ...memberData,
          createdAt: new Date(),
        },
      ])
      .select()

    if (error) throw error
    return { success: true, teamMember: data[0] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Update Team Member
export const updateTeamMember = async (memberId, memberData) => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .update(memberData)
      .eq('id', memberId)
      .select()

    if (error) throw error
    return { success: true, teamMember: data[0] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Delete Team Member
export const deleteTeamMember = async (memberId) => {
  try {
    const { error } = await supabase.from('team_members').delete().eq('id', memberId)

    if (error) throw error
    return { success: true, message: 'Team member deleted' }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ==================== ORDER MANAGEMENT ====================

// Get All Orders
export const getAllOrders = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, users(name, email, phone)')
      .order('createdAt', { ascending: false })

    if (error) throw error
    return { success: true, orders: data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Update Order Status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updatedAt: new Date() })
      .eq('id', orderId)
      .select()

    if (error) throw error
    return { success: true, order: data[0] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Send Notification to User
export const sendNotificationToUser = async (userId, message, type = 'text') => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([
        {
          userId,
          message,
          type,
          read: false,
          createdAt: new Date(),
        },
      ])
      .select()

    if (error) throw error
    return { success: true, notification: data[0] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ==================== BOOKING MANAGEMENT ====================

// Get All Bookings
export const getAllBookings = async () => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, users(name, email), services(name)')
      .order('createdAt', { ascending: false })

    if (error) throw error
    return { success: true, bookings: data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Update Booking Status
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status, updatedAt: new Date() })
      .eq('id', bookingId)
      .select()

    if (error) throw error
    return { success: true, booking: data[0] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ==================== APPOINTMENT MANAGEMENT ====================

// Get All Appointments
export const getAllAppointments = async () => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, users(name, email, phone)')
      .order('appointmentDate', { ascending: true })

    if (error) throw error
    return { success: true, appointments: data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Update Appointment Status
export const updateAppointmentStatus = async (appointmentId, status) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status, updatedAt: new Date() })
      .eq('id', appointmentId)
      .select()

    if (error) throw error
    return { success: true, appointment: data[0] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ==================== USER MANAGEMENT ====================

// Get All Users
export const getAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('createdAt', { ascending: false })

    if (error) throw error
    return { success: true, users: data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Get User Orders
export const getUserOrders = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })

    if (error) throw error
    return { success: true, orders: data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Get User Payments
export const getUserPayments = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })

    if (error) throw error
    return { success: true, payments: data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ==================== DASHBOARD STATS ====================

// Get Dashboard Statistics
export const getDashboardStats = async () => {
  try {
    // Total Users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    // Total Orders
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })

    // Total Revenue
    const { data: payments } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'Completed')

    const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

    // Pending Orders
    const { count: pendingOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Pending')

    // Completed Orders
    const { count: completedOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Completed')

    return {
      success: true,
      stats: {
        totalUsers: totalUsers || 0,
        totalOrders: totalOrders || 0,
        totalRevenue,
        pendingOrders: pendingOrders || 0,
        completedOrders: completedOrders || 0,
      },
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ==================== WEBSITE SETTINGS ====================

// Get Website Settings
export const getWebsiteSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('website_settings')
      .select('*')
      .single()

    if (error && error.code !== 'PGRST116') throw error

    return {
      success: true,
      settings: data || {},
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Update Website Settings
export const updateWebsiteSettings = async (settingsData) => {
  try {
    const { data, error } = await supabase
      .from('website_settings')
      .upsert(settingsData)
      .select()

    if (error) throw error
    return { success: true, settings: data[0] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
