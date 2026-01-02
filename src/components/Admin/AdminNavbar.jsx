import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { Bell, Settings, User, Menu } from 'lucide-react'

const AdminNavbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { admin } = useAuth()

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      {/* Left Side */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300 hidden md:block"
        >
          <Menu size={20} className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-dark">Admin Dashboard</h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-300">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Settings */}
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-300">
          <Settings size={20} />
        </button>

        {/* Admin Profile */}
        <div className="flex items-center space-x-3 pl-6 border-l border-gray-200">
          <div className="w-10 h-10 bg-gradient-bg rounded-full flex items-center justify-center text-white font-bold">
            {admin?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-dark">Admin</p>
            <p className="text-xs text-gray-600">{admin?.email}</p>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default AdminNavbar
