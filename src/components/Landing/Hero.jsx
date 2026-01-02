import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Zap, Shield, Rocket } from 'lucide-react'

const Hero = () => {
  const navigate = useNavigate()

  const features = [
    { icon: Zap, label: 'Fast & Reliable' },
    { icon: Shield, label: 'Secure Solutions' },
    { icon: Rocket, label: 'Growth Focused' },
  ]

  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-slideUp">
            <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-primary rounded-full text-sm font-semibold">
              ✨ Welcome to WPFixHub
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-dark mb-6 leading-tight">
              Your Digital Marketing
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {' '}
                Partner
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Professional WordPress fixes, digital marketing strategies, and web development solutions
              tailored to grow your business. Let's transform your online presence together.
            </p>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                    <feature.icon size={24} className="text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-dark">{feature.label}</p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/user/login')}
                className="px-8 py-4 bg-gradient-bg text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 hover-lift"
              >
                <span>Get Started</span>
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => {
                  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300"
              >
                Explore Services
              </button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              <div>
                <p className="text-3xl font-bold text-primary">500+</p>
                <p className="text-gray-600 text-sm">Happy Clients</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">1000+</p>
                <p className="text-gray-600 text-sm">Projects Done</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">10+</p>
                <p className="text-gray-600 text-sm">Years Experience</p>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="hidden lg:flex items-center justify-center animate-fadeIn">
            <div className="relative w-full h-96">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-3xl opacity-10 blur-3xl"></div>

              {/* Card Stack Illustration */}
              <div className="absolute top-0 right-0 w-64 h-40 bg-white rounded-2xl shadow-lg p-6 transform rotate-6 hover-lift">
                <div className="w-full h-3 bg-primary rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-64 h-40 bg-white rounded-2xl shadow-lg p-6 transform -rotate-6 hover-lift">
                <div className="w-full h-3 bg-secondary rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>

              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-40 bg-gradient-bg rounded-2xl shadow-xl p-6 text-white">
                <div className="w-full h-3 bg-white rounded mb-4 opacity-50"></div>
                <div className="space-y-2">
                  <div className="h-2 bg-white rounded w-3/4 opacity-50"></div>
                  <div className="h-2 bg-white rounded w-1/2 opacity-50"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
