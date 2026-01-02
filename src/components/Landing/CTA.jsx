import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle } from 'lucide-react'

const CTA = () => {
  const navigate = useNavigate()

  const benefits = [
    'Free consultation',
    'Custom solutions',
    'Expert support',
    'Guaranteed results',
  ]

  return (
    <section id="contact" className="py-20 bg-gradient-to-r from-primary to-secondary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Content */}
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 animate-slideUp">
          Ready to Transform Your Business?
        </h2>

        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto animate-slideUp">
          Join hundreds of satisfied clients who have grown their business with WPFixHub. Let's start your
          success story today!
        </p>

        {/* Benefits */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center justify-center space-x-2 animate-slideUp"
              style={{ animationDelay: `${index * 100}ms` }}>
              <CheckCircle size={20} className="text-white flex-shrink-0" />
              <span className="text-white font-semibold text-sm">{benefit}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp">
          <button
            onClick={() => navigate('/user/login')}
            className="px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 hover-lift"
          >
            <span>Get Started Now</span>
            <ArrowRight size={20} />
          </button>
          <button
            onClick={() => navigate('/admin/login')}
            className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary transition-all duration-300"
          >
            Admin Access
          </button>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-blue-300">
          <p className="text-blue-100 mb-2">Have questions? Contact us anytime</p>
          <a
            href="mailto:info@wp-fixhub.com"
            className="text-white font-semibold hover:underline transition-all duration-300"
          >
            info@wp-fixhub.com
          </a>
        </div>
      </div>
    </section>
  )
}

export default CTA
