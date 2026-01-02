import React, { useState, useEffect } from 'react'
import { Eye, CheckCircle, X } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { getAllBookings, updateBookingStatus } from '../../services/adminService'
import LoadingSpinner from '../Common/LoadingSpinner'
import { formatDate, getStatusColor } from '../../utils/helpers'
import { BOOKING_STATUS } from '../../utils/constants'

const BookingManagement = () => {
  const { bookings, setBookings } = useAdmin()
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const result = await getAllBookings()
      if (result.success) {
        setBookings(result.bookings)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const result = await updateBookingStatus(bookingId, newStatus)
      if (result.success) {
        setBookings(bookings.map((b) => (b.id === bookingId ? result.booking : b)))
      }
    } catch (error) {
      console.error('Error updating booking status:', error)
    }
  }

  const filteredBookings = filterStatus === 'All' 
    ? bookings 
    : bookings.filter((b) => b.status === filterStatus)

  if (loading) {
    return <LoadingSpinner message="Loading bookings..." />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-dark">Booking Management</h1>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600 font-semibold">Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>All</option>
            {Object.values(BOOKING_STATUS).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-light border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Booking ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Service</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Booking Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-200 hover:bg-light transition-colors duration-300">
                  <td className="px-6 py-4 font-semibold text-dark">#{booking.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-dark">{booking.users?.name || 'N/A'}</p>
                      <p className="text-sm text-gray-600">{booking.users?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{booking.services?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(booking.bookingDate)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-300"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {Object.values(BOOKING_STATUS).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-dark">Booking Details</h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Booking Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Booking ID</p>
                  <p className="text-lg font-bold text-dark">#{selectedBooking.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-dark mb-4">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Name</p>
                    <p className="font-semibold text-dark">{selectedBooking.users?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-semibold text-dark">{selectedBooking.users?.email}</p>
                  </div>
                </div>
              </div>

              {/* Service & Dates */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-dark mb-4">Booking Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Service</p>
                    <p className="font-semibold text-dark">{selectedBooking.services?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Booking Date</p>
                    <p className="font-semibold text-dark">{formatDate(selectedBooking.bookingDate)}</p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No bookings found.</p>
        </div>
      )}
    </div>
  )
}

export default BookingManagement
