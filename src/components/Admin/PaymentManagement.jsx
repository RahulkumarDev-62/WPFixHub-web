import React, { useState, useEffect } from 'react'
import { Eye, Download, X } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { getAllOrders } from '../../services/adminService'
import LoadingSpinner from '../Common/LoadingSpinner'
import { formatDate, formatCurrency, getStatusColor } from '../../utils/helpers'
import { PAYMENT_STATUS } from '../../utils/constants'

const PaymentManagement = () => {
  const { orders, setOrders } = useAdmin()
  const [loading, setLoading] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const result = await getAllOrders()
      if (result.success) {
        setOrders(result.orders)
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const payments = orders.map((order) => ({
    id: order.id,
    orderId: order.id,
    customerName: order.users?.name || 'N/A',
    customerEmail: order.users?.email,
    amount: order.amount,
    status: order.status === 'Completed' ? 'Completed' : 'Pending',
    paymentMethod: order.paymentMethod || 'Razorpay',
    transactionId: order.transactionId || `TXN-${order.id}`,
    date: order.createdAt,
  }))

  const filteredPayments = filterStatus === 'All' 
    ? payments 
    : payments.filter((p) => p.status === filterStatus)

  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0)
  const completedPayments = payments.filter((p) => p.status === 'Completed').length

  if (loading) {
    return <LoadingSpinner message="Loading payments..." />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-dark">Payment Management</h1>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600 font-semibold">Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>All</option>
            {Object.values(PAYMENT_STATUS).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 card-shadow">
          <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-primary">{formatCurrency(totalRevenue)}</p>
          <p className="text-xs text-gray-500 mt-2">From {payments.length} transactions</p>
        </div>
        <div className="bg-white rounded-2xl p-6 card-shadow">
          <p className="text-gray-600 text-sm mb-2">Completed Payments</p>
          <p className="text-3xl font-bold text-green-600">{completedPayments}</p>
          <p className="text-xs text-gray-500 mt-2">{Math.round((completedPayments / payments.length) * 100)}% success rate</p>
        </div>
        <div className="bg-white rounded-2xl p-6 card-shadow">
          <p className="text-gray-600 text-sm mb-2">Pending Payments</p>
          <p className="text-3xl font-bold text-yellow-600">{payments.length - completedPayments}</p>
          <p className="text-xs text-gray-500 mt-2">Awaiting completion</p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-light border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Transaction ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Method</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-200 hover:bg-light transition-colors duration-300">
                  <td className="px-6 py-4 font-semibold text-dark">{payment.transactionId}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-dark">{payment.customerName}</p>
                      <p className="text-sm text-gray-600">{payment.customerEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-primary">{formatCurrency(payment.amount)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{payment.paymentMethod}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(payment.date)}</td>
                  <td className="px-6 py-4 flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedPayment(payment)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-300"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-300"
                      title="Download Receipt"
                    >
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-dark">Payment Details</h2>
              <button
                onClick={() => setSelectedPayment(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Payment Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
                  <p className="text-lg font-bold text-dark">{selectedPayment.transactionId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedPayment.status)}`}>
                    {selectedPayment.status}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-dark mb-4">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Name</p>
                    <p className="font-semibold text-dark">{selectedPayment.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-semibold text-dark">{selectedPayment.customerEmail}</p>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-dark mb-4">Payment Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Amount</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(selectedPayment.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                    <p className="font-semibold text-dark">{selectedPayment.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Order ID</p>
                    <p className="font-semibold text-dark">#{selectedPayment.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Date</p>
                    <p className="font-semibold text-dark">{formatDate(selectedPayment.date)}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-6 flex gap-4">
                <button className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold flex items-center justify-center space-x-2">
                  <Download size={18} />
                  <span>Download Receipt</span>
                </button>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-dark rounded-lg hover:bg-gray-50 transition-colors duration-300 font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredPayments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No payments found.</p>
        </div>
      )}
    </div>
  )
}

export default PaymentManagement
