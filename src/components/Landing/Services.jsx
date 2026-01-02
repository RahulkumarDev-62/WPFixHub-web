import React, { useState, useEffect } from 'react'
import { Code, Zap, TrendingUp, Shield, Smartphone, Palette } from 'lucide-react'
import { getAllServices } from '../../services/userService'
import LoadingSpinner from '../Common/LoadingSpinner'

const Services = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  const defaultServices = [
    {
      id: 1,
      name: 'WordPress Fixes',
      description: 'Expert WordPress troubleshooting and maintenance',
      icon: Code,
      features: ['Bug Fixes', 'Performance Optimization', 'Security Updates'],
      price: '₹5,000',
    },
    {
      id: 2,
      name: 'Digital Marketing',
      description: 'Comprehensive digital marketing strategies',
      icon: TrendingUp,
      features: ['SEO Optimization', 'Social Media', 'Content Marketing'],
      price: '₹10,000',
    },
    {
      id: 3,
      name: 'Web Development',
      description: 'Custom web development solutions',
      icon: Smartphone,
      features: ['Responsive Design', 'Fast Loading', 'Modern Stack'],
      price: '₹15,000',
    },
    {
      id: 4,
      name: 'Security Solutions',
      description: 'Protect your website from threats',
      icon: Shield,
      features: ['SSL Certificate', 'Malware Removal', 'Backup'],
      price: '₹3,000',
    },
    {
      id: 5,
      name: 'UI/UX Design',
      description: 'Beautiful and user-friendly designs',
      icon: Palette,
      features: ['Wireframing', 'Prototyping', 'User Testing'],
      price: '₹8,000',
    },
    {
      id: 6,
      name: 'Performance Boost',
      description: 'Speed up your website significantly',
      icon: Zap,
      features: ['Image Optimization', 'Caching', 'CDN Setup'],
      price: '₹4,000',
    },
  ]

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const result = await getAllServices()
        if (result.success && result.services.length > 0) {
          setServices(result.services)
        } else {
          setServices(defaultServices)
        }
      } catch (error) {
        console.error('Error fetching services:', error)
        setServices(defaultServices)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  if (loading) {
    return <LoadingSpinner message="Loading services..." />
  }

  return (
    <section id="services" className="py-20 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slideUp">
          <h2 className="text-4xl lg:text-5xl font-bold text-dark mb-4">
            Our <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive solutions to elevate your digital presence and grow your business
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon || Code
            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl p-8 card-shadow hover-lift transition-all duration-300 animate-slideUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-6">
                  <IconComponent size={32} className="text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-dark mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {(service.features || []).map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-gray-700">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Price and Button */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <span className="text-2xl font-bold text-primary">{service.price}</span>
                  <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 text-sm font-semibold">
                    Learn More
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Services
