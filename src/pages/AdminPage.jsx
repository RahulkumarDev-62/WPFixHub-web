import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Users2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AdminNavbar from '../components/Admin/AdminNavbar'

const AdminPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const { logoutAdmin } = useAuth()

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Package, label: 'Services', path: '/admin/services' },
    { icon: Users2, label: 'Team', path: '/admin/team' },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
    { icon: Calendar, label: 'Bookings', path: '/admin/bookings' },
    { icon: Clock, label: 'Appointments', path: '/admin/appointments' },
    { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: FileText, label: 'Invoices', path: '/admin/invoices' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ]

  const handleLogout = () => {
    logoutAdmin()
    navigate('/admin/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="flex h-screen bg-light">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-dark text-white transition-all duration-300 flex flex-col fixed h-screen z-40 md:relative`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && <span className="text-2xl font-bold">WPFixHub</span>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-300 md:hidden"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive(item.path)
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
              title={!sidebarOpen ? item.label : ''}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-300"
            title={!sidebarOpen ? 'Logout' : ''}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-0 ml-0">
        <AdminNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  )
}

export default AdminPage
