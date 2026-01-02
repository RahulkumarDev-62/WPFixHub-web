import React, { useState, useEffect } from 'react'
import { Mail, Linkedin, Twitter, MapPin } from 'lucide-react'
import { getAllTeamMembers } from '../../services/adminService'
import LoadingSpinner from '../Common/LoadingSpinner'

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)

  const defaultTeam = [
    {
      id: 1,
      name: 'Rahul Kumar',
      role: 'Founder & CEO',
      bio: 'Digital marketing expert with 10+ years of experience',
      profileImage: 'https://via.placeholder.com/300x300?text=Rahul',
      email: 'rahul@wp-fixhub.com',
      linkedin: '#',
      twitter: '#',
    },
    {
      id: 2,
      name: 'Divya Singh',
      role: 'Lead Developer',
      bio: 'Full-stack developer specializing in WordPress',
      profileImage: 'https://via.placeholder.com/300x300?text=Divya',
      email: 'divya@wp-fixhub.com',
      linkedin: '#',
      twitter: '#',
    },
    {
      id: 3,
      name: 'Priya Sharma',
      role: 'Marketing Manager',
      bio: 'SEO and content marketing specialist',
      profileImage: 'https://via.placeholder.com/300x300?text=Priya',
      email: 'priya@wp-fixhub.com',
      linkedin: '#',
      twitter: '#',
    },
    {
      id: 4,
      name: 'Amit Patel',
      role: 'UI/UX Designer',
      bio: 'Creative designer with eye for details',
      profileImage: 'https://via.placeholder.com/300x300?text=Amit',
      email: 'amit@wp-fixhub.com',
      linkedin: '#',
      twitter: '#',
    },
  ]

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const result = await getAllTeamMembers()
        if (result.success && result.teamMembers.length > 0) {
          setTeamMembers(result.teamMembers)
        } else {
          setTeamMembers(defaultTeam)
        }
      } catch (error) {
        console.error('Error fetching team:', error)
        setTeamMembers(defaultTeam)
      } finally {
        setLoading(false)
      }
    }

    fetchTeam()
  }, [])

  if (loading) {
    return <LoadingSpinner message="Loading team..." />
  }

  return (
    <section id="team" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slideUp">
          <h2 className="text-4xl lg:text-5xl font-bold text-dark mb-4">
            Meet Our <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Team</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Talented professionals dedicated to your success
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className="bg-light rounded-2xl overflow-hidden card-shadow hover-lift transition-all duration-300 animate-slideUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden bg-gradient-bg">
                <img
                  src={member.profileImage}
                  alt={member.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-dark mb-1">{member.name}</h3>
                <p className="text-primary font-semibold text-sm mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm mb-4">{member.bio}</p>

                {/* Social Links */}
                <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                  <a
                    href={`mailto:${member.email}`}
                    className="p-2 bg-white rounded-lg text-gray-600 hover:text-primary hover:bg-blue-50 transition-all duration-300"
                    aria-label="Email"
                  >
                    <Mail size={18} />
                  </a>
                  <a
                    href={member.linkedin}
                    className="p-2 bg-white rounded-lg text-gray-600 hover:text-primary hover:bg-blue-50 transition-all duration-300"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={18} />
                  </a>
                  <a
                    href={member.twitter}
                    className="p-2 bg-white rounded-lg text-gray-600 hover:text-primary hover:bg-blue-50 transition-all duration-300"
                    aria-label="Twitter"
                  >
                    <Twitter size={18} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Team
