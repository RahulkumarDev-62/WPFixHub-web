import { supabase } from './supabaseClient'

// ==================== ORDER MANAGEMENT ====================

// Create Order
export const createOrder = async (userId, orderData) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          userId,
          ...orderData,
          status: 'Pending',
          createdAt: new Date(),
        },
      ])
      .select()

    if (error) throw error
    return { success: true, order: data[0] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Get User Orders
export const getUserOrders = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, services(name, price)')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })

    if (error) throw error
    return { success: true, orders: data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Get Order Details
export const getOrderDetails = async (orderId) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, services(name, price, description)')
      .eq('id', orderId)
      .single()

    if (error) throw error
    return { success: true, order: data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Update Order
export const updateOrder = async (orderId, orderData) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update(orderData)
      .eq('id', orderId)
      .select()

    if (error) throw error
    return { success: true, order: data[0] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Cancel Order
export const cancelOrder = async (orderId) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: 'Cancelled', updatedAt: new Date() })
      .eq('id', orderId)
      .select()

    if (error) throw error
    return { success: true, order: data[0] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ==================== BOOKING MANAGEMENT ====================

// Create Booking
export const createBooking = async (userId, bookingData) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          userId,
          ...bookingData,
          status: 'Pending',
          createdAt: new Date(),
        },
      ])
      .select()

    if (error) throw error
    return { success: true, booking: data[0] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Get User Bookings
export const getUserBookings = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, services(name, price)')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })

    if (error) throw error
    return { success: true, bookings: data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Cancel Booking
export const cancelBooking = async (bookingId) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'Cancelled', updatedAt: new Date() })
      .eq('id', bookingId)
      .select()

    if (error) throw error
    return { success: true, booking: data[0] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ==================== APPOINTMENT MANAGEMENT ====================

// Create Appointment
export const createAppointment = async (userId, appointmentData) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          userId,
          ...appointmentData,
          status: 'Pending',
          createdAt: new Date(),
        },
      ])
      .select()

    if (error) throw error
    return { success: true, appointment: data[0] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Get User Appointments
export const getUserAppointments = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('userId', userId)
      .order('appointmentDate', { ascending: true })

    if (error) throw error
    return { success: true, appointments: data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Cancel Appointment
export const cancelAppointment = async (appointmentId) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status: 'Cancelled', updatedAt: new Date() })
      .eq('id', appointmentId)
      .select()

    if (error) throw error
    return { success: true, appointment: data[0] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ==================== PAYMENT MANAGEMENT ====================

// Create Payment
export const createPayment = async (userId, paymentData) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert([
        {
          userId,
          ...paymentData,
          status: 'Pending',
          createdAt: new Date(),
        },
      ])
      .select()

    if (error) throw error
    return { success: true, payment: data[0] }
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

// Update Payment Status
export const updatePaymentStatus = async (paymentId, status) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .update({ status, updatedAt: new Date() })
      .eq('id', paymentId)
      .select()

    if (error) throw error
    return { success: true, payment: data[0] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ==================== SERVICES ====================

// Get All Services
export const getAllServices = async () => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('createdAt', { ascending: false })

    if (error) throw error
    return { success: true, services: data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Get Service Details
export const getServiceDetails = async (serviceId) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .single()

    if (error) throw error
    return { success: true, service: data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ==================== INVOICES ====================

// Create Invoice
export const createInvoice = async (userId, invoiceData) => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .insert([
        {
          userId,
          ...invoiceData,
          createdAt: new Date(),
        },
      ])
      .select()

    if (error) throw error
    return { success: true, invoice: data[0] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Get User Invoices
export const getUserInvoices = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })

    if (error) throw error
    return { success: true, invoices: data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Get Invoice Details
export const getInvoiceDetails = async (invoiceId) => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single()

    if (error) throw error
    return { success: true, invoice: data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
