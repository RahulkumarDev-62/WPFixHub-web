import React, { useState } from 'react'
import { Calendar, Clock, User, Mail, Phone, Check, Loader } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useUser } from '../../context/UserContext'
import { createAppointment } from '../../services/userService'

const AppointmentBooking = () => {
  const { user } = useAuth()
  const { createAppointment: contextCreateAppointment } = useUser()
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    topic: '',
    description: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.appointmentDate || !formData.appointmentTime || !user?.id) return

    setSubmitting(true)

    try {
      const result = await createAppointment(user.id, formData)
      if (result.success) {
        setSuccessMessage('Appointment scheduled successfully!')
        setFormData({
          appointmentDate: '',
          appointmentTime: '',
          topic: '',
          description: '',
        })
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error creating appointment:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark mb-2">Schedule an Appointment</h1>
        <p className="text-gray-600">Book a consultation with our team</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 font-semibold flex items-center space-x-2">
            <Check size={20} />
            <span>{successMessage}</span>
          </p>
        </div>
      )}

      {/* Appointment Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-8 card-shadow">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Your Information */}
              <div className="pb-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-dark mb-4">Your Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Full Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="text"
                        value={user?.name || ''}
                        disabled
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Email</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Phone</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="tel"
                        value={user?.phone || ''}
                        disabled
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="pb-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-dark mb-4">Appointment Details</h3>
                <div className="space-y-4">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Appointment Date</label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="date"
                        name="appointmentDate"
                        value={formData.appointmentDate}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Appointment Time</label>
                    <div className="relative">
                      <Clock size={18} className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="time"
                        name="appointmentTime"
                        value={formData.appointmentTime}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>

                  {/* Topic */}
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Topic/Reason</label>
                    <input
                      type="text"
                      name="topic"
                      value={formData.topic}
                      onChange={handleInputChange}
                      placeholder="e.g., Website Consultation, SEO Discussion"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your appointment needs..."
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !formData.appointmentDate || !formData.appointmentTime}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    <span>Scheduling...</span>
                  </>
                ) : (
                  <>
                    <Calendar size={18} />
                    <span>Schedule Appointment</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Appointment Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 card-shadow sticky top-6">
            <h3 className="text-xl font-bold text-dark mb-6">Appointment Info</h3>

            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Duration</p>
                <p className="font-bold text-dark">30 minutes</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Meeting Type</p>
                <p className="font-bold text-dark">Video Call</p>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h4 className="font-bold text-dark mb-3">What to Expect:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start space-x-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Personalized consultation</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Expert advice</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Custom solutions</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Follow-up support</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  You'll receive a confirmation email with meeting details and a video call link.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentBooking
