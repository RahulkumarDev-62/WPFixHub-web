import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { getAllServices, createService, updateService, deleteService } from '../../services/adminService'
import LoadingSpinner from '../Common/LoadingSpinner'

const ServiceManagement = () => {
  const { services, setServices } = useAdmin()
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    features: '',
    icon: '',
    image: '',
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const result = await getAllServices()
      if (result.success) {
        setServices(result.services)
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

    const serviceData = {
      ...formData,
      features: formData.features.split(',').map((f) => f.trim()),
      price: parseFloat(formData.price),
    }

    try {
      if (editingId) {
        const result = await updateService(editingId, serviceData)
        if (result.success) {
          setServices(services.map((s) => (s.id === editingId ? result.service : s)))
        }
      } else {
        const result = await createService(serviceData)
        if (result.success) {
          setServices([...services, result.service])
        }
      }
      resetForm()
    } catch (error) {
      console.error('Error saving service:', error)
    }
  }

  const handleEdit = (service) => {
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      features: service.features?.join(', ') || '',
      icon: service.icon || '',
      image: service.image || '',
    })
    setEditingId(service.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const result = await deleteService(id)
        if (result.success) {
          setServices(services.filter((s) => s.id !== id))
        }
      } catch (error) {
        console.error('Error deleting service:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      features: '',
      icon: '',
      image: '',
    })
    setEditingId(null)
    setShowForm(false)
  }

  if (loading) {
    return <LoadingSpinner message="Loading services..." />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-dark">Service Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold"
        >
          <Plus size={20} />
          <span>Add Service</span>
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-dark">
                {editingId ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Service Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., WordPress Fixes"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Service description"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="5000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Icon</label>
                  <input
                    type="text"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    placeholder="icon-name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Features (comma-separated)
                </label>
                <textarea
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  placeholder="Feature 1, Feature 2, Feature 3"
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold"
                >
                  {editingId ? 'Update Service' : 'Add Service'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-dark rounded-lg hover:bg-gray-50 transition-colors duration-300 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Services Table */}
      <div className="bg-white rounded-2xl overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-light border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Service Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Features</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b border-gray-200 hover:bg-light transition-colors duration-300">
                  <td className="px-6 py-4 font-semibold text-dark">{service.name}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{service.description}</td>
                  <td className="px-6 py-4 font-bold text-primary">₹{service.price}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {service.features?.length || 0} features
                  </td>
                  <td className="px-6 py-4 flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-300"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {services.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No services found. Create your first service!</p>
        </div>
      )}
    </div>
  )
}

export default ServiceManagement
