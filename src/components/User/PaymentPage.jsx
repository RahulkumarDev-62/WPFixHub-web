import React, { useState, useEffect } from 'react'
import { CreditCard, Loader, Check, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useUser } from '../../context/UserContext'
import { getUserOrders } from '../../services/userService'
import { createRazorpayOrder, verifyRazorpayPayment } from '../../services/paymentService'
import LoadingSpinner from '../Common/LoadingSpinner'
import { formatCurrency } from '../../utils/helpers'

const PaymentPage = () => {
  const { user } = useAuth()
  const { userOrders, setUserOrders } = useUser()
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('razorpay')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [user?.id])

  const fetchOrders = async () => {
    if (!user?.id) return

    try {
      const result = await getUserOrders(user.id)
      if (result.success) {
        setUserOrders(result.orders)
        // Select first pending order
        const pendingOrder = result.orders.find((o) => o.status === 'Pending')
        if (pendingOrder) {
          setSelectedOrder(pendingOrder)
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRazorpayPayment = async () => {
    if (!selectedOrder) return

    setProcessing(true)
    setError('')

    try {
      // Create Razorpay order
      const orderResult = await createRazorpayOrder(
        selectedOrder.amount,
        selectedOrder.id,
        user.email,
        user.name
      )

      if (!orderResult.success) {
        throw new Error(orderResult.error)
      }

      // Load Razorpay script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.onload = () => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: orderResult.amount,
          currency: orderResult.currency,
          name: 'WPFixHub',
          description: `Order #${selectedOrder.id}`,
          order_id: orderResult.razorpayOrderId,
          handler: async (response) => {
            try {
              const verifyResult = await verifyRazorpayPayment(
                orderResult.razorpayOrderId,
                response.razorpay_payment_id,
                response.razorpay_signature
              )

              if (verifyResult.success) {
                setSuccessMessage('Payment successful! Your order has been confirmed.')
                setTimeout(() => {
                  window.location.href = '/user/dashboard'
                }, 2000)
              }
            } catch (err) {
              setError('Payment verification failed. Please contact support.')
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone,
          },
          theme: {
            color: '#3B82F6',
          },
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
      }
      document.body.appendChild(script)
    } catch (err) {
      setError(err.message || 'Payment initiation failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading payment details..." />
  }

  const pendingOrders = userOrders.filter((o) => o.status === 'Pending')

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark mb-2">Payment</h1>
        <p className="text-gray-600">Complete your payment to confirm your order</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
          <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-8 card-shadow">
            <h2 className="text-2xl font-bold text-dark mb-6">Pending Orders</h2>

            {pendingOrders.length > 0 ? (
              <div className="space-y-4">
                {pendingOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                      selectedOrder?.id === order.id
                        ? 'border-primary bg-blue-50'
                        : 'border-gray-200 hover:border-primary'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-dark mb-2">Order #{order.id}</h3>
                        <p className="text-gray-600">{order.services?.name || 'Service'}</p>
                      </div>
                      {selectedOrder?.id === order.id && (
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Check size={16} className="text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-gray-600">Amount to Pay:</span>
                      <span className="text-2xl font-bold text-primary">₹{order.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No pending orders</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 card-shadow sticky top-6">
            <h3 className="text-xl font-bold text-dark mb-6">Payment Summary</h3>

            {selectedOrder ? (
              <div className="space-y-6">
                {/* Order Details */}
                <div className="pb-6 border-b border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Order ID</p>
                  <p className="font-bold text-dark">#{selectedOrder.id}</p>
                </div>

                <div className="pb-6 border-b border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Service</p>
                  <p className="font-bold text-dark">{selectedOrder.services?.name || 'Service'}</p>
                </div>

                {/* Amount */}
                <div className="pb-6 border-b border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Amount</p>
                  <p className="text-3xl font-bold text-primary">{formatCurrency(selectedOrder.amount)}</p>
                </div>

                {/* Payment Method */}
                <div className="pb-6 border-b border-gray-200">
                  <p className="text-sm font-semibold text-dark mb-3">Payment Method</p>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={paymentMethod === 'razorpay'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-gray-700">Razorpay (Cards, UPI, Wallets)</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="phonpe"
                        checked={paymentMethod === 'phonpe'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-gray-700">PhonePe</span>
                    </label>
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handleRazorpayPayment}
                  disabled={processing || !selectedOrder}
                  className="w-full py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {processing ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={18} />
                      <span>Pay Now</span>
                    </>
                  )}
                </button>

                {/* Security Info */}
                <p className="text-xs text-gray-500 text-center">
                  🔒 Your payment is secure and encrypted
                </p>
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">Select an order to proceed</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage
