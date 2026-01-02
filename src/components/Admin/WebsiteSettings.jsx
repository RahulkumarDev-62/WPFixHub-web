import React, { useState, useEffect } from 'react'
import { Save, Loader } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { getWebsiteSettings, updateWebsiteSettings } from '../../services/adminService'
import LoadingSpinner from '../Common/LoadingSpinner'

const WebsiteSettings = () => {
  const { websiteSettings, updateWebsiteSettings: contextUpdateSettings } = useAdmin()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState(websiteSettings)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const result = await getWebsiteSettings()
      if (result.success) {
        setFormData(result.settings)
        contextUpdateSettings(result.settings)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
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
    setSaving(true)

    try {
      const result = await updateWebsiteSettings(formData)
      if (result.success) {
        contextUpdateSettings(result.settings)
        setSuccessMessage('Settings updated successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error updating settings:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading settings..." />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark mb-2">Website Settings</h1>
        <p className="text-gray-600">Manage your website configuration and business information</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 font-semibold">{successMessage}</p>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Information */}
        <div className="bg-white rounded-2xl p-8 card-shadow">
          <h2 className="text-2xl font-bold text-dark mb-6">Business Information</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName || ''}
                onChange={handleInputChange}
                placeholder="WPFixHub"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Business Email</label>
                <input
                  type="email"
                  name="businessEmail"
                  value={formData.businessEmail || ''}
                  onChange={handleInputChange}
                  placeholder="info@wp-fixhub.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Business Phone</label>
                <input
                  type="tel"
                  name="businessPhone"
                  value={formData.businessPhone || ''}
                  onChange={handleInputChange}
                  placeholder="+91-XXXXXXXXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Business Address</label>
              <textarea
                name="businessAddress"
                value={formData.businessAddress || ''}
                onChange={handleInputChange}
                placeholder="Enter your business address"
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Logo & Branding */}
        <div className="bg-white rounded-2xl p-8 card-shadow">
          <h2 className="text-2xl font-bold text-dark mb-6">Logo & Branding</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Logo URL</label>
              <input
                type="url"
                name="logo"
                value={formData.logo || ''}
                onChange={handleInputChange}
                placeholder="https://example.com/logo.png"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {formData.logo && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Logo Preview:</p>
                  <img src={formData.logo} alt="Logo" className="h-16 object-contain" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Configuration */}
        <div className="bg-white rounded-2xl p-8 card-shadow">
          <h2 className="text-2xl font-bold text-dark mb-6">Payment Configuration</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Razorpay Key ID</label>
              <input
                type="password"
                name="razorpayKeyId"
                value={formData.razorpayKeyId || ''}
                onChange={handleInputChange}
                placeholder="Enter your Razorpay Key ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500 mt-2">Keep this secure. Never share publicly.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">PhonePe API Key</label>
              <input
                type="password"
                name="phonpeApiKey"
                value={formData.phonpeApiKey || ''}
                onChange={handleInputChange}
                placeholder="Enter your PhonePe API Key"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500 mt-2">Keep this secure. Never share publicly.</p>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-2xl p-8 card-shadow">
          <h2 className="text-2xl font-bold text-dark mb-6">Social Media Links</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Facebook URL</label>
              <input
                type="url"
                name="facebookUrl"
                value={formData.facebookUrl || ''}
                onChange={handleInputChange}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Twitter URL</label>
              <input
                type="url"
                name="twitterUrl"
                value={formData.twitterUrl || ''}
                onChange={handleInputChange}
                placeholder="https://twitter.com/..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">LinkedIn URL</label>
              <input
                type="url"
                name="linkedinUrl"
                value={formData.linkedinUrl || ''}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/company/..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Instagram URL</label>
              <input
                type="url"
                name="instagramUrl"
                value={formData.instagramUrl || ''}
                onChange={handleInputChange}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-8 py-4 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {saving ? (
              <>
                <Loader size={20} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default WebsiteSettings
