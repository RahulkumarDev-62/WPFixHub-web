import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { getAllTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from '../../services/adminService'
import LoadingSpinner from '../Common/LoadingSpinner'

const TeamManagement = () => {
  const { teamMembers, setTeamMembers } = useAdmin()
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    email: '',
    phone: '',
    profileImage: '',
    linkedin: '',
    twitter: '',
  })

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      const result = await getAllTeamMembers()
      if (result.success) {
        setTeamMembers(result.teamMembers)
      }
    } catch (error) {
      console.error('Error fetching team members:', error)
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

    try {
      if (editingId) {
        const result = await updateTeamMember(editingId, formData)
        if (result.success) {
          setTeamMembers(teamMembers.map((m) => (m.id === editingId ? result.teamMember : m)))
        }
      } else {
        const result = await createTeamMember(formData)
        if (result.success) {
          setTeamMembers([...teamMembers, result.teamMember])
        }
      }
      resetForm()
    } catch (error) {
      console.error('Error saving team member:', error)
    }
  }

  const handleEdit = (member) => {
    setFormData(member)
    setEditingId(member.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        const result = await deleteTeamMember(id)
        if (result.success) {
          setTeamMembers(teamMembers.filter((m) => m.id !== id))
        }
      } catch (error) {
        console.error('Error deleting team member:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      bio: '',
      email: '',
      phone: '',
      profileImage: '',
      linkedin: '',
      twitter: '',
    })
    setEditingId(null)
    setShowForm(false)
  }

  if (loading) {
    return <LoadingSpinner message="Loading team members..." />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-dark">Team Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold"
        >
          <Plus size={20} />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-dark">
                {editingId ? 'Edit Team Member' : 'Add New Team Member'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Role</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    placeholder="e.g., Lead Developer"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Brief bio about the team member"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91-9876543210"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Profile Image URL</label>
                <input
                  type="url"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">LinkedIn URL</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Twitter URL</label>
                  <input
                    type="url"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    placeholder="https://twitter.com/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold"
                >
                  {editingId ? 'Update Member' : 'Add Member'}
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

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-2xl overflow-hidden card-shadow hover-lift transition-all duration-300">
            {/* Image */}
            <div className="h-48 bg-gradient-bg overflow-hidden">
              <img
                src={member.profileImage || 'https://via.placeholder.com/300x300?text=Team'}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-dark mb-1">{member.name}</h3>
              <p className="text-primary font-semibold text-sm mb-3">{member.role}</p>
              <p className="text-gray-600 text-sm mb-4">{member.bio}</p>

              {/* Contact Info */}
              <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Email:</span> {member.email}
                </p>
                {member.phone && (
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Phone:</span> {member.phone}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(member)}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold text-sm flex items-center justify-center space-x-2"
                >
                  <Edit2 size={16} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="flex-1 px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors duration-300 font-semibold text-sm flex items-center justify-center space-x-2"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {teamMembers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No team members found. Add your first team member!</p>
        </div>
      )}
    </div>
  )
}

export default TeamManagement
