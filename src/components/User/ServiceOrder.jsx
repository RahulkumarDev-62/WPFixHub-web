import React, { useState, useEffect } from 'react'
import { ShoppingCart, Check, Loader } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useUser } from '../../context/UserContext'
import { getAllServices } from '../../services/userService'
import { createOrder } from '../../services/userService'
import LoadingSpinner from '../Common/LoadingSpinner'
import { formatCurrency } from '../../utils/helpers'

const ServiceOrder = () => {
  const { user } = useAuth()
  const { availableServices, setAvailableServices, createOrder: contextCreateOrder } = useUser()
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

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

  const handleOrderSubmit = async (e) => {
    e.preventDefault()
    if (!selectedService || !user?.id) return

    setSubmitting(true)

    try {
      const orderData = {
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        quantity,
        amount: selectedService.price * quantity,
        notes,
        status: 'Pending',
      }

      const result = await createOrder(user.id, orderData)
      if (result.success) {
        setSuccessMessage('Order placed successfully! Redirecting to payment...')
        setTimeout(() => {
          window.location.href = '/user/payment'
        }, 2000)
      }
    } catch (error) {
      console.error('Error placing order:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading services..." />
  }

  const totalAmount = selectedService ? selectedService.price * quantity : 0
  const tax = Math.round(totalAmount * 0.18)
  const finalAmount = totalAmount + tax

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark mb-2">Order Services</h1>
        <p className="text-gray-600">Choose a service and place your order</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Services List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold text-dark mb-6">Available Services</h2>
          {availableServices.map((service) => (
            <div
              key={service.id}
              onClick={() => setSelectedService(service)}
              className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                selectedService?.id === service.id
                  ? 'bg-primary text-white card-shadow'
                  : 'bg-white card-shadow hover:shadow-lg'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                  <p className={selectedService?.id === service.id ? 'text-blue-100' : 'text-gray-600'}>
                    {service.description}
                  </p>
                </div>
                {selectedService?.id === service.id && (
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <Check size={20} className="text-primary" />
                  </div>
                )}
              </div>

              {/* Features */}
              {service.features && service.features.length > 0 && (
                <div className="mb-4 space-y-2">
                  {service.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm">
                      <span className={selectedService?.id === service.id ? 'text-blue-200' : 'text-gray-500'}>✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Price */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className={`text-2xl font-bold ${selectedService?.id === service.id ? 'text-white' : 'text-primary'}`}>
                  ₹{service.price}
                </span>
                <span className={`text-sm font-semibold ${selectedService?.id === service.id ? 'text-blue-100' : 'text-gray-600'}`}>
                  Per order
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 card-shadow sticky top-6">
            <h3 className="text-xl font-bold text-dark mb-6">Order Summary</h3>

            {selectedService ? (
              <form onSubmit={handleOrderSubmit} className="space-y-6">
                {/* Service Details */}
                <div className="pb-6 border-b border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Selected Service</p>
                  <p className="font-bold text-dark">{selectedService.name}</p>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Quantity</label>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-primary"
                      min="1"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Additional Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requirements?"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pb-6 border-b border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold text-dark">₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (18%):</span>
                    <span className="font-semibold text-dark">₹{tax}</span>
                  </div>
                  <div className="flex justify-between pt-3">
                    <span className="font-bold text-dark">Total:</span>
                    <span className="text-2xl font-bold text-primary">₹{finalAmount}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      <span>Proceed to Payment</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Select a service to place an order</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceOrder
