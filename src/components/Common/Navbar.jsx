import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, LogIn } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Team', href: '#team' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-bg rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">WF</span>
            </div>
            <span className="text-xl font-bold text-dark hidden sm:inline">WPFixHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-700 hover:text-primary transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => navigate('/user/login')}
              className="flex items-center space-x-2 px-4 py-2 text-primary hover:bg-blue-50 rounded-lg transition-colors duration-300"
            >
              <LogIn size={18} />
              <span>User Login</span>
            </button>
            <button
              onClick={() => navigate('/admin/login')}
              className="px-4 py-2 bg-gradient-bg text-white rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Admin Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 animate-slideUp">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  navigate('/user/login')
                  setIsOpen(false)
                }}
                className="px-4 py-2 text-primary hover:bg-blue-50 rounded-lg transition-colors duration-300 text-left"
              >
                User Login
              </button>
              <button
                onClick={() => {
                  navigate('/admin/login')
                  setIsOpen(false)
                }}
                className="px-4 py-2 bg-gradient-bg text-white rounded-lg transition-colors duration-300"
              >
                Admin Login
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
