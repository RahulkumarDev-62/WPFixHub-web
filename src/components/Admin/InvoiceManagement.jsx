import React, { useState, useEffect } from 'react'
import { Eye, Download, X, FileText } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { getAllOrders } from '../../services/adminService'
import LoadingSpinner from '../Common/LoadingSpinner'
import { formatDate, formatCurrency } from '../../utils/helpers'

const InvoiceManagement = () => {
  const { orders, setOrders } = useAdmin()
  const [loading, setLoading] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const result = await getAllOrders()
      if (result.success) {
        setOrders(result.orders)
      }
    } catch (error) {
      console.error('Error fetching invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const invoices = orders.map((order) => ({
    id: order.id,
    invoiceNumber: `INV-${order.id}`,
    customerName: order.users?.name || 'N/A',
    customerEmail: order.users?.email,
    serviceName: order.services?.name || 'N/A',
    amount: order.amount,
    tax: Math.round(order.amount * 0.18),
    total: order.amount + Math.round(order.amount * 0.18),
    status: order.status === 'Completed' ? 'Paid' : 'Pending',
    date: order.createdAt,
  }))

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <LoadingSpinner message="Loading invoices..." />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-dark">Invoice Management</h1>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 card-shadow">
          <p className="text-gray-600 text-sm mb-2">Total Invoices</p>
          <p className="text-3xl font-bold text-primary">{invoices.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 card-shadow">
          <p className="text-gray-600 text-sm mb-2">Paid Invoices</p>
          <p className="text-3xl font-bold text-green-600">{invoices.filter((i) => i.status === 'Paid').length}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 card-shadow">
          <p className="text-gray-600 text-sm mb-2">Total Amount</p>
          <p className="text-3xl font-bold text-primary">{formatCurrency(invoices.reduce((sum, i) => sum + i.total, 0))}</p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-light border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Invoice #</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Service</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-200 hover:bg-light transition-colors duration-300">
                  <td className="px-6 py-4 font-semibold text-dark">{invoice.invoiceNumber}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-dark">{invoice.customerName}</p>
                      <p className="text-sm text-gray-600">{invoice.customerEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{invoice.serviceName}</td>
                  <td className="px-6 py-4 font-bold text-primary">{formatCurrency(invoice.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      invoice.status === 'Paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(invoice.date)}</td>
                  <td className="px-6 py-4 flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedInvoice(invoice)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-300"
                      title="View Invoice"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-300"
                      title="Download Invoice"
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

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-dark">Invoice Details</h2>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Invoice Header */}
              <div className="flex items-center justify-between pb-6 border-b">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText size={24} className="text-primary" />
                    <h3 className="text-2xl font-bold text-dark">{selectedInvoice.invoiceNumber}</h3>
                  </div>
                  <p className="text-gray-600">{formatDate(selectedInvoice.date)}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  selectedInvoice.status === 'Paid'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedInvoice.status}
                </span>
              </div>

              {/* Customer Info */}
              <div>
                <h4 className="font-bold text-dark mb-3">Bill To:</h4>
                <p className="font-semibold text-dark">{selectedInvoice.customerName}</p>
                <p className="text-gray-600">{selectedInvoice.customerEmail}</p>
              </div>

              {/* Service Details */}
              <div className="border-t pt-6">
                <h4 className="font-bold text-dark mb-4">Service Details</h4>
                <div className="bg-light rounded-lg p-4">
                  <div className="flex justify-between mb-3">
                    <span className="font-semibold text-dark">{selectedInvoice.serviceName}</span>
                    <span className="font-bold text-primary">{formatCurrency(selectedInvoice.amount)}</span>
                  </div>
                </div>
              </div>

              {/* Totals */}
              <div className="border-t pt-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-dark">{formatCurrency(selectedInvoice.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18%):</span>
                  <span className="font-semibold text-dark">{formatCurrency(selectedInvoice.tax)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="font-bold text-dark">Total:</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(selectedInvoice.total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-6 flex gap-4">
                <button className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold flex items-center justify-center space-x-2">
                  <Download size={18} />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-dark rounded-lg hover:bg-gray-50 transition-colors duration-300 font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No invoices found.</p>
        </div>
      )}
    </div>
  )
}

export default InvoiceManagement
