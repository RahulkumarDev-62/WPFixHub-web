import React, { useState, useEffect } from 'react'
import { Users, ShoppingCart, TrendingUp, Clock } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { getDashboardStats } from '../../services/adminService'
import LoadingSpinner from '../Common/LoadingSpinner'
import { formatCurrency } from '../../utils/helpers'

const AdminDashboard = () => {
  const { stats, updateStats } = useAdmin()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getDashboardStats()
        if (result.success) {
          updateStats(result.stats)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [updateStats])

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />
  }

  const statCards = [
    {
      icon: Users,
      label: 'Total Users',
      value: stats.totalUsers,
      color: 'bg-blue-100',
      iconColor: 'text-primary',
    },
    {
      icon: ShoppingCart,
      label: 'Total Orders',
      value: stats.totalOrders,
      color: 'bg-purple-100',
      iconColor: 'text-secondary',
    },
    {
      icon: TrendingUp,
      label: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      color: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      icon: Clock,
      label: 'Pending Orders',
      value: stats.pendingOrders,
      color: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
  ]

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-bg text-white rounded-2xl p-8 animate-slideUp">
        <h1 className="text-4xl font-bold mb-2">Welcome back, Admin! 👋</h1>
        <p className="text-blue-100">Here's what's happening with your business today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 card-shadow hover-lift transition-all duration-300 animate-slideUp"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon size={24} className={card.iconColor} />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-2">{card.label}</p>
            <p className="text-3xl font-bold text-dark">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Overview */}
        <div className="bg-white rounded-2xl p-6 card-shadow animate-slideUp">
          <h3 className="text-xl font-bold text-dark mb-6">Orders Overview</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Completed</span>
                <span className="text-sm font-bold text-green-600">{stats.completedOrders}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${
                      stats.totalOrders > 0
                        ? (stats.completedOrders / stats.totalOrders) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Pending</span>
                <span className="text-sm font-bold text-yellow-600">{stats.pendingOrders}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{
                    width: `${
                      stats.totalOrders > 0
                        ? (stats.pendingOrders / stats.totalOrders) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 card-shadow animate-slideUp">
          <h3 className="text-xl font-bold text-dark mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold">
              Add New Service
            </button>
            <button className="w-full px-4 py-3 bg-secondary text-white rounded-lg hover:bg-purple-600 transition-colors duration-300 font-semibold">
              Add Team Member
            </button>
            <button className="w-full px-4 py-3 border-2 border-primary text-primary rounded-lg hover:bg-blue-50 transition-colors duration-300 font-semibold">
              View All Orders
            </button>
            <button className="w-full px-4 py-3 border-2 border-primary text-primary rounded-lg hover:bg-blue-50 transition-colors duration-300 font-semibold">
              Manage Users
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 card-shadow animate-slideUp">
        <h3 className="text-xl font-bold text-dark mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-b-0">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <ShoppingCart size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-dark">New Order Received</p>
                  <p className="text-sm text-gray-600">Order #12345 from John Doe</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
