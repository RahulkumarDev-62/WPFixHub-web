import React, { createContext, useState } from 'react'

export const AdminContext = createContext()

export const AdminProvider = ({ children }) => {
  // Services State
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)

  // Team Members State
  const [teamMembers, setTeamMembers] = useState([])
  const [selectedTeamMember, setSelectedTeamMember] = useState(null)

  // Orders State
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Bookings State
  const [bookings, setBookings] = useState([])
  const [selectedBooking, setSelectedBooking] = useState(null)

  // Appointments State
  const [appointments, setAppointments] = useState([])
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  // Users State
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)

  // Payments State
  const [payments, setPayments] = useState([])

  // Dashboard Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  })

  // Website Settings
  const [websiteSettings, setWebsiteSettings] = useState({
    logo: '',
    businessName: 'WPFixHub',
    businessEmail: 'info@wp-fixhub.com',
    businessPhone: '+91-XXXXXXXXXX',
    businessAddress: '',
    razorpayKeyId: '',
    phonpeApiKey: '',
  })

  // Service Management
  const addService = (service) => {
    const newService = {
      id: Date.now(),
      ...service,
      createdAt: new Date(),
    }
    setServices([...services, newService])
    return newService
  }

  const updateService = (id, updatedService) => {
    setServices(services.map((s) => (s.id === id ? { ...s, ...updatedService } : s)))
  }

  const deleteService = (id) => {
    setServices(services.filter((s) => s.id !== id))
  }

  // Team Management
  const addTeamMember = (member) => {
    const newMember = {
      id: Date.now(),
      ...member,
      createdAt: new Date(),
    }
    setTeamMembers([...teamMembers, newMember])
    return newMember
  }

  const updateTeamMember = (id, updatedMember) => {
    setTeamMembers(teamMembers.map((m) => (m.id === id ? { ...m, ...updatedMember } : m)))
  }

  const deleteTeamMember = (id) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id))
  }

  // Order Management
  const updateOrderStatus = (orderId, status) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)))
  }

  const sendNotificationToUser = (orderId, message) => {
    // This would integrate with notification service
    console.log(`Notification sent for order ${orderId}: ${message}`)
  }

  // Booking Management
  const updateBookingStatus = (bookingId, status) => {
    setBookings(bookings.map((b) => (b.id === bookingId ? { ...b, status } : b)))
  }

  // Appointment Management
  const approveAppointment = (appointmentId) => {
    updateAppointmentStatus(appointmentId, 'Approved')
  }

  const rejectAppointment = (appointmentId) => {
    updateAppointmentStatus(appointmentId, 'Rejected')
  }

  const updateAppointmentStatus = (appointmentId, status) => {
    setAppointments(appointments.map((a) => (a.id === appointmentId ? { ...a, status } : a)))
  }

  // Update Website Settings
  const updateWebsiteSettings = (newSettings) => {
    setWebsiteSettings({ ...websiteSettings, ...newSettings })
  }

  // Update Dashboard Stats
  const updateStats = (newStats) => {
    setStats({ ...stats, ...newStats })
  }

  const value = {
    // Services
    services,
    selectedService,
    setSelectedService,
    addService,
    updateService,
    deleteService,

    // Team
    teamMembers,
    selectedTeamMember,
    setSelectedTeamMember,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,

    // Orders
    orders,
    selectedOrder,
    setSelectedOrder,
    setOrders,
    updateOrderStatus,
    sendNotificationToUser,

    // Bookings
    bookings,
    selectedBooking,
    setSelectedBooking,
    setBookings,
    updateBookingStatus,

    // Appointments
    appointments,
    selectedAppointment,
    setSelectedAppointment,
    setAppointments,
    approveAppointment,
    rejectAppointment,
    updateAppointmentStatus,

    // Users
    users,
    selectedUser,
    setSelectedUser,
    setUsers,

    // Payments
    payments,
    setPayments,

    // Stats & Settings
    stats,
    updateStats,
    websiteSettings,
    updateWebsiteSettings,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

// Custom Hook to use AdminContext
export const useAdmin = () => {
  const context = React.useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}
