import React, { useState, useEffect } from 'react'
import { Calendar, Clock, Check, Loader } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useUser } from '../../context/UserContext'
import { getAllServices } from '../../services/userService'
import { createBooking } from '../../services/userService'
import LoadingSpinner from '../Common/LoadingSpinner'

const BookingSystem = () => {
  const { user } = useAuth()
  const { availableServices, setAvailableServices } = useUser()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState({
    serviceId: '',
    bookingDate: '',
    bookingTime: '',
    notes: '',
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const result = await getAllServices()
      if (result.success) {
        setAvailableServices(result.services)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.serviceId || !formData.bookingDate || !formData.bookingTime || !user?.id) return

    setSubmitting(true)

    try {
      const result = await createBooking(user.id, formData)
      if (result.success) {
        setSuccessMessage('Booking confirmed successfully!')
        setFormData({
          serviceId: '',
          bookingDate: '',
          bookingTime: '',
          notes: '',
        })
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error creating booking:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading services..." />
  }

  const selectedService = availableServices.find((s) => s.id === parseInt(formData.serviceId))

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark mb-2">Book a Service</h1>
        <p className="text-gray-600">Schedule your service appointment</p>
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

      {/* Booking Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-8 card-shadow">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Selection */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Select Service</label>
                <select
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Choose a service...</option>
                  {availableServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - ₹{service.price}
                    </option>
                  ))}
                </select>
              </div>

              {/* Booking Date */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Booking Date</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="date"
                    name="bookingDate"
                    value={formData.bookingDate}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              {/* Booking Time */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Booking Time</label>
                <div className="relative">
                  <Clock size={18} className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="time"
                    name="bookingTime"
                    value={formData.bookingTime}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Additional Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any special requirements or preferences?"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !formData.serviceId}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    <span>Booking...</span>
                  </>
                ) : (
                  <>
                    <Calendar size={18} />
                    <span>Confirm Booking</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 card-shadow sticky top-6">
            <h3 className="text-xl font-bold text-dark mb-6">Booking Summary</h3>

            {selectedService ? (
              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Service</p>
                  <p className="font-bold text-dark">{selectedService.name}</p>
                </div>

                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Date</p>
                  <p className="font-bold text-dark">
                    {formData.bookingDate ? new Date(formData.bookingDate).toLocaleDateString() : 'Not selected'}
                  </p>
                </div>

                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Time</p>
                  <p className="font-bold text-dark">{formData.bookingTime || 'Not selected'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Price</p>
                  <p className="text-2xl font-bold text-primary">₹{selectedService.price}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">Select a service to see details</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingSystem

