import React, { useState, useEffect } from 'react'
import { Download, Eye, X, FileText } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useUser } from '../../context/UserContext'
import { getUserInvoices } from '../../services/userService'
import { generateInvoicePDF } from '../../services/invoiceService'
import LoadingSpinner from '../Common/LoadingSpinner'
import { formatDate, formatCurrency } from '../../utils/helpers'

const InvoiceDownload = () => {
  const { user } = useAuth()
  const { userInvoices, setUserInvoices } = useUser()
  const [loading, setLoading] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchInvoices()
  }, [user?.id])

  const fetchInvoices = async () => {
    if (!user?.id) return

    try {
      const result = await getUserInvoices(user.id)
      if (result.success) {
        setUserInvoices(result.invoices)
      }
    } catch (error) {
      console.error('Error fetching invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (invoice) => {
    try {
      const invoiceData = {
        invoiceNumber: invoice.invoiceNumber || `INV-${invoice.id}`,
        date: invoice.createdAt,
        dueDate: new Date(new Date(invoice.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000),
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone,
        items: [
          {
            description: invoice.description || 'Service',
            quantity: 1,
            rate: invoice.amount,
            amount: invoice.amount,
          },
        ],
        subtotal: invoice.amount,
        tax: Math.round(invoice.amount * 0.18),
        total: invoice.amount + Math.round(invoice.amount * 0.18),
        notes: `Thank you for your business. Order ID: ${invoice.orderId || invoice.id}`,
      }

      await generateInvoicePDF(invoiceData, `invoice_${invoice.invoiceNumber}.pdf`)
    } catch (error) {
      console.error('Error downloading invoice:', error)
    }
  }

  const filteredInvoices = userInvoices.filter((invoice) =>
    invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <LoadingSpinner message="Loading invoices..." />
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark mb-2">Invoices</h1>
        <p className="text-gray-600">Download and manage your invoices</p>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Search invoices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-light border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Invoice #</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-200 hover:bg-light transition-colors duration-300">
                  <td className="px-6 py-4 font-semibold text-dark">{invoice.invoiceNumber || `INV-${invoice.id}`}</td>
                  <td className="px-6 py-4 text-gray-600">{invoice.description || 'Service'}</td>
                  <td className="px-6 py-4 font-bold text-primary">{formatCurrency(invoice.amount)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(invoice.createdAt)}</td>
                  <td className="px-6 py-4 flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedInvoice(invoice)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-300"
                      title="View Invoice"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDownload(invoice)}
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
                    <h3 className="text-2xl font-bold text-dark">
                      {selectedInvoice.invoiceNumber || `INV-${selectedInvoice.id}`}
                    </h3>
                  </div>
                  <p className="text-gray-600">{formatDate(selectedInvoice.createdAt)}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h4 className="font-bold text-dark mb-3">Bill To:</h4>
                <p className="font-semibold text-dark">{user.name}</p>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-600">{user.phone}</p>
              </div>

              {/* Invoice Details */}
              <div className="border-t pt-6">
                <h4 className="font-bold text-dark mb-4">Invoice Details</h4>
                <div className="bg-light rounded-lg p-4">
                  <div className="flex justify-between mb-3">
                    <span className="font-semibold text-dark">{selectedInvoice.description || 'Service'}</span>
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
                  <span className="font-semibold text-dark">
                    {formatCurrency(Math.round(selectedInvoice.amount * 0.18))}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="font-bold text-dark">Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(selectedInvoice.amount + Math.round(selectedInvoice.amount * 0.18))}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-6 flex gap-4">
                <button
                  onClick={() => handleDownload(selectedInvoice)}
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold flex items-center justify-center space-x-2"
                >
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

export default InvoiceDownload
