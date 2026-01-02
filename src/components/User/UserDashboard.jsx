import React, { useState, useEffect } from 'react'
import { ShoppingCart, Calendar, Clock, FileText, TrendingUp, ArrowRight } from 'lucide-react'
import { useUser } from '../../context/UserContext'
import { useAuth } from '../../context/AuthContext'
import { getUserOrders, getUserBookings, getUserAppointments, getUserPayments } from '../../services/userService'
import LoadingSpinner from '../Common/LoadingSpinner'
import { formatDate, formatCurrency } from '../../utils/helpers'

const UserDashboard = () => {
  const { user } = useAuth()
  const { userOrders, setUserOrders, userBookings, setUserBookings, userAppointments, setUserAppointments, userPayments, setUserPayments } = useUser()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [user?.id])

  const fetchUserData = async () => {
    if (!user?.id) return

    try {
      const [ordersResult, bookingsResult, appointmentsResult, paymentsResult] = await Promise.all([
        getUserOrders(user.id),
        getUserBookings(user.id),
        getUserAppointments(user.id),
        getUserPayments(user.id),
      ])

      if (ordersResult.success) setUserOrders(ordersResult.orders)
      if (bookingsResult.success) setUserBookings(bookingsResult.bookings)
      if (appointmentsResult.success) setUserAppointments(appointmentsResult.appointments)
      if (paymentsResult.success) setUserPayments(paymentsResult.payments)
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />
  }

  const totalSpent = userPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
  const pendingOrders = userOrders.filter((o) => o.status === 'Pending').length
  const completedOrders = userOrders.filter((o) => o.status === 'Completed').length

  const stats = [
    {
      icon: ShoppingCart,
      label: 'Total Orders',
      value: userOrders.length,
      color: 'bg-blue-100',
      iconColor: 'text-primary',
    },
    {
      icon: Calendar,
      label: 'Bookings',
      value: userBookings.length,
      color: 'bg-purple-100',
      iconColor: 'text-secondary',
    },
    {
      icon: Clock,
      label: 'Appointments',
      value: userAppointments.length,
      color: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      icon: TrendingUp,
      label: 'Total Spent',
      value: formatCurrency(totalSpent),
      color: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
  ]

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-bg text-white rounded-2xl p-8 animate-slideUp">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
        <p className="text-blue-100">Here's your account overview and recent activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 card-shadow hover-lift transition-all duration-300 animate-slideUp"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon size={24} className={stat.iconColor} />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-dark">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 card-shadow animate-slideUp">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-dark">Recent Orders</h3>
            <a href="/user/order" className="text-primary hover:underline font-semibold text-sm flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight size={16} />
            </a>
          </div>

          {userOrders.length > 0 ? (
            <div className="space-y-4">
              {userOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-light rounded-lg hover:bg-gray-100 transition-colors duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <ShoppingCart size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-dark">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">₹{order.amount}</p>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      order.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No orders yet. Start by placing an order!</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 card-shadow animate-slideUp">
          <h3 className="text-xl font-bold text-dark mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/user/order"
              className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold text-center block"
            >
              Place Order
            </a>
            <a
              href="/user/booking"
              className="w-full px-4 py-3 bg-secondary text-white rounded-lg hover:bg-purple-600 transition-colors duration-300 font-semibold text-center block"
            >
              Book Service
            </a>
            <a
              href="/user/appointment"
              className="w-full px-4 py-3 border-2 border-primary text-primary rounded-lg hover:bg-blue-50 transition-colors duration-300 font-semibold text-center block"
            >
              Schedule Appointment
            </a>
            <a
              href="/user/invoices"
              className="w-full px-4 py-3 border-2 border-primary text-primary rounded-lg hover:bg-blue-50 transition-colors duration-300 font-semibold text-center block"
            >
              View Invoices
            </a>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      {userAppointments.length > 0 && (
        <div className="bg-white rounded-2xl p-6 card-shadow animate-slideUp">
          <h3 className="text-xl font-bold text-dark mb-6">Upcoming Appointments</h3>
          <div className="space-y-4">
            {userAppointments.slice(0, 3).map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 bg-light rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark">{appointment.topic || 'General Consultation'}</p>
                    <p className="text-sm text-gray-600">{formatDate(appointment.appointmentDate)}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded bg-blue-100 text-blue-800">
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default UserDashboard
