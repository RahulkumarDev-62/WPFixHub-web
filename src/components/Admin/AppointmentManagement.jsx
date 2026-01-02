import React, { useState, useEffect } from 'react'
import { Eye, CheckCircle, X, Clock } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { getAllAppointments, updateAppointmentStatus } from '../../services/adminService'
import LoadingSpinner from '../Common/LoadingSpinner'
import { formatDate, formatTime, getStatusColor } from '../../utils/helpers'
import { APPOINTMENT_STATUS } from '../../utils/constants'

const AppointmentManagement = () => {
  const { appointments, setAppointments } = useAdmin()
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const result = await getAllAppointments()
      if (result.success) {
        setAppointments(result.appointments)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const result = await updateAppointmentStatus(appointmentId, newStatus)
      if (result.success) {
        setAppointments(appointments.map((a) => (a.id === appointmentId ? result.appointment : a)))
      }
    } catch (error) {
      console.error('Error updating appointment status:', error)
    }
  }

  const filteredAppointments = filterStatus === 'All' 
    ? appointments 
    : appointments.filter((a) => a.status === filterStatus)

  if (loading) {
    return <LoadingSpinner message="Loading appointments..." />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-dark">Appointment Management</h1>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600 font-semibold">Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>All</option>
            {Object.values(APPOINTMENT_STATUS).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-2xl overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-light border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Appointment ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Date & Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Topic</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="border-b border-gray-200 hover:bg-light transition-colors duration-300">
                  <td className="px-6 py-4 font-semibold text-dark">#{appointment.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-dark">{appointment.users?.name || 'N/A'}</p>
                      <p className="text-sm text-gray-600">{appointment.users?.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Clock size={16} />
                      <span>{formatDate(appointment.appointmentDate)} {formatTime(appointment.appointmentTime)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{appointment.topic || 'General'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedAppointment(appointment)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-300"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <select
                      value={appointment.status}
                      onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {Object.values(APPOINTMENT_STATUS).map((status) => (
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

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-dark">Appointment Details</h2>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Appointment Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Appointment ID</p>
                  <p className="text-lg font-bold text-dark">#{selectedAppointment.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedAppointment.status)}`}>
                    {selectedAppointment.status}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-dark mb-4">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Name</p>
                    <p className="font-semibold text-dark">{selectedAppointment.users?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-semibold text-dark">{selectedAppointment.users?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p className="font-semibold text-dark">{selectedAppointment.users?.phone}</p>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-dark mb-4">Appointment Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Date</p>
                    <p className="font-semibold text-dark">{formatDate(selectedAppointment.appointmentDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Time</p>
                    <p className="font-semibold text-dark">{formatTime(selectedAppointment.appointmentTime)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Topic</p>
                    <p className="font-semibold text-dark">{selectedAppointment.topic || 'General Consultation'}</p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedAppointment(null)}
                className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No appointments found.</p>
        </div>
      )}
    </div>
  )
}

export default AppointmentManagement
