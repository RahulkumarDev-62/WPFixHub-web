import React, { createContext, useState } from 'react'

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  // User Orders
  const [userOrders, setUserOrders] = useState([])
  const [selectedUserOrder, setSelectedUserOrder] = useState(null)

  // User Bookings
  const [userBookings, setUserBookings] = useState([])
  const [selectedUserBooking, setSelectedUserBooking] = useState(null)

  // User Appointments
  const [userAppointments, setUserAppointments] = useState([])
  const [selectedUserAppointment, setSelectedUserAppointment] = useState(null)

  // User Payments
  const [userPayments, setUserPayments] = useState([])
  const [selectedUserPayment, setSelectedUserPayment] = useState(null)

  // Available Services (for ordering)
  const [availableServices, setAvailableServices] = useState([])

  // User Profile
  const [userProfile, setUserProfile] = useState({
    id: null,
    name: '',
    email: '',
    phone: '',
    profileImage: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  })

  // Order Management
  const createOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),
      ...orderData,
      status: 'Pending',
      createdAt: new Date(),
    }
    setUserOrders([...userOrders, newOrder])
    return newOrder
  }

  const updateOrder = (orderId, updatedData) => {
    setUserOrders(userOrders.map((o) => (o.id === orderId ? { ...o, ...updatedData } : o)))
  }

  const cancelOrder = (orderId) => {
    updateOrder(orderId, { status: 'Cancelled' })
  }

  // Booking Management
  const createBooking = (bookingData) => {
    const newBooking = {
      id: Date.now(),
      ...bookingData,
      status: 'Pending',
      createdAt: new Date(),
    }
    setUserBookings([...userBookings, newBooking])
    return newBooking
  }

  const updateBooking = (bookingId, updatedData) => {
    setUserBookings(userBookings.map((b) => (b.id === bookingId ? { ...b, ...updatedData } : b)))
  }

  const cancelBooking = (bookingId) => {
    updateBooking(bookingId, { status: 'Cancelled' })
  }

  // Appointment Management
  const createAppointment = (appointmentData) => {
    const newAppointment = {
      id: Date.now(),
      ...appointmentData,
      status: 'Pending',
      createdAt: new Date(),
    }
    setUserAppointments([...userAppointments, newAppointment])
    return newAppointment
  }

  const updateAppointment = (appointmentId, updatedData) => {
    setUserAppointments(
      userAppointments.map((a) => (a.id === appointmentId ? { ...a, ...updatedData } : a))
    )
  }

  const cancelAppointment = (appointmentId) => {
    updateAppointment(appointmentId, { status: 'Cancelled' })
  }

  // Payment Management
  const createPayment = (paymentData) => {
    const newPayment = {
      id: Date.now(),
      ...paymentData,
      status: 'Pending',
      createdAt: new Date(),
    }
    setUserPayments([...userPayments, newPayment])
    return newPayment
  }

  const updatePayment = (paymentId, updatedData) => {
    setUserPayments(userPayments.map((p) => (p.id === paymentId ? { ...p, ...updatedData } : p)))
  }

  // Profile Management
  const updateUserProfile = (updatedProfile) => {
    setUserProfile({ ...userProfile, ...updatedProfile })
  }

  const changePassword = (oldPassword, newPassword) => {
    // This would integrate with authentication service
    console.log('Password change requested')
    return true
  }

  const value = {
    // Orders
    userOrders,
    selectedUserOrder,
    setSelectedUserOrder,
    setUserOrders,
    createOrder,
    updateOrder,
    cancelOrder,

    // Bookings
    userBookings,
    selectedUserBooking,
    setSelectedUserBooking,
    setUserBookings,
    createBooking,
    updateBooking,
    cancelBooking,

    // Appointments
    userAppointments,
    selectedUserAppointment,
    setSelectedUserAppointment,
    setUserAppointments,
    createAppointment,
    updateAppointment,
    cancelAppointment,

    // Payments
    userPayments,
    selectedUserPayment,
    setSelectedUserPayment,
    setUserPayments,
    createPayment,
    updatePayment,

    // Services
    availableServices,
    setAvailableServices,

    // Profile
    userProfile,
    updateUserProfile,
    changePassword,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

// Custom Hook to use UserContext
export const useUser = () => {
  const context = React.useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}
