import React, { useState, useEffect } from 'react'
import { Eye, CheckCircle, Clock, X } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { getAllOrders, updateOrderStatus } from '../../services/adminService'
import LoadingSpinner from '../Common/LoadingSpinner'
import { formatDate, getStatusColor } from '../../utils/helpers'
import { ORDER_STATUS } from '../../utils/constants'

const OrderManagement = () => {
  const { orders, setOrders } = useAdmin()
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const result = await getAllOrders()
      if (result.success) {
        setOrders(result.orders)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const result = await updateOrderStatus(orderId, newStatus)
      if (result.success) {
        setOrders(orders.map((o) => (o.id === orderId ? result.order : o)))
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const filteredOrders = filterStatus === 'All' 
    ? orders 
    : orders.filter((o) => o.status === filterStatus)

  if (loading) {
    return <LoadingSpinner message="Loading orders..." />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-dark">Order Management</h1>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600 font-semibold">Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>All</option>
            {Object.values(ORDER_STATUS).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-light border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Service</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-200 hover:bg-light transition-colors duration-300">
                  <td className="px-6 py-4 font-semibold text-dark">#{order.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-dark">{order.users?.name || 'N/A'}</p>
                      <p className="text-sm text-gray-600">{order.users?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{order.services?.name || 'N/A'}</td>
                  <td className="px-6 py-4 font-bold text-primary">₹{order.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-4 flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-300"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {Object.values(ORDER_STATUS).map((status) => (
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-dark">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order ID</p>
                  <p className="text-lg font-bold text-dark">#{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-dark mb-4">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Name</p>
                    <p className="font-semibold text-dark">{selectedOrder.users?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-semibold text-dark">{selectedOrder.users?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p className="font-semibold text-dark">{selectedOrder.users?.phone}</p>
                  </div>
                </div>
              </div>

              {/* Service Info */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-dark mb-4">Service Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Service</p>
                    <p className="font-semibold text-dark">{selectedOrder.services?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Amount</p>
                    <p className="font-bold text-primary text-lg">₹{selectedOrder.amount}</p>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="border-t pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Order Date</p>
                    <p className="font-semibold text-dark">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                    <p className="font-semibold text-dark">{formatDate(selectedOrder.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No orders found.</p>
        </div>
      )}
    </div>
  )
}

export default OrderManagement
