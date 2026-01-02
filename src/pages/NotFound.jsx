import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="text-center animate-slideUp">
        {/* 404 Text */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-4xl font-bold text-dark mb-4">Page Not Found</h2>
          <p className="text-xl text-gray-600 mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-12">
          <div className="inline-block">
            <div className="w-64 h-64 bg-gradient-to-br from-primary to-secondary rounded-full opacity-10 blur-3xl"></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gradient-bg text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 hover-lift"
          >
            <Home size={20} />
            <span>Go Home</span>
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Go Back</span>
          </button>
        </div>

        {/* Help Text */}
        <p className="mt-12 text-gray-600">
          Need help? <a href="mailto:info@wp-fixhub.com" className="text-primary hover:underline font-semibold">
            Contact us
          </a>
        </p>
      </div>
    </div>
  )
}

export default NotFound
