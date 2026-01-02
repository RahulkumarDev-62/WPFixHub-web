import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AdminProvider } from './context/AdminContext'
import { UserProvider } from './context/UserContext'

// Pages
import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'
import UserPage from './pages/UserPage'
import NotFound from './pages/NotFound'

// Common Components
import ProtectedRoute from './components/Common/ProtectedRoute'
import AIAssistant from './components/Common/AIAssistant'

// Admin Components
import AdminLogin from './components/Admin/AdminLogin'
import AdminDashboard from './components/Admin/AdminDashboard'
import ServiceManagement from './components/Admin/ServiceManagement'
import TeamManagement from './components/Admin/TeamManagement'
import OrderManagement from './components/Admin/OrderManagement'
import BookingManagement from './components/Admin/BookingManagement'
import AppointmentManagement from './components/Admin/AppointmentManagement'
import PaymentManagement from './components/Admin/PaymentManagement'
import UserManagement from './components/Admin/UserManagement'
import InvoiceManagement from './components/Admin/InvoiceManagement'
import WebsiteSettings from './components/Admin/WebsiteSettings'

// User Components
import UserRegister from './components/User/UserRegister'
import UserLogin from './components/User/UserLogin'
import UserDashboard from './components/User/UserDashboard'
import ServiceOrder from './components/User/ServiceOrder'
import BookingSystem from './components/User/BookingSystem'
import AppointmentBooking from './components/User/AppointmentBooking'
import PaymentPage from './components/User/PaymentPage'
import ProfileSettings from './components/User/ProfileSettings'
import InvoiceDownload from './components/User/InvoiceDownload'

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <UserProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={<NotFound />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPage />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="services" element={<ServiceManagement />} />
                <Route path="team" element={<TeamManagement />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="bookings" element={<BookingManagement />} />
                <Route path="appointments" element={<AppointmentManagement />} />
                <Route path="payments" element={<PaymentManagement />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="invoices" element={<InvoiceManagement />} />
                <Route path="settings" element={<WebsiteSettings />} />
              </Route>

              {/* User Routes */}
              <Route path="/user/register" element={<UserRegister />} />
              <Route path="/user/login" element={<UserLogin />} />
              <Route
                path="/user"
                element={
                  <ProtectedRoute requiredRole="user">
                    <UserPage />
                  </ProtectedRoute>
                }
              >
                <Route index element={<UserDashboard />} />
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="order" element={<ServiceOrder />} />
                <Route path="booking" element={<BookingSystem />} />
                <Route path="appointment" element={<AppointmentBooking />} />
                <Route path="payment" element={<PaymentPage />} />
                <Route path="profile" element={<ProfileSettings />} />
                <Route path="invoices" element={<InvoiceDownload />} />
              </Route>
            </Routes>

            {/* AI Assistant - Available on all pages */}
            <AIAssistant />
          </UserProvider>
        </AdminProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
