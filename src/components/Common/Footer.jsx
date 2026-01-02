import React from 'react'
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Services: [
      { label: 'WordPress Fixes', href: '#' },
      { label: 'Digital Marketing', href: '#' },
      { label: 'Web Development', href: '#' },
      { label: 'SEO Optimization', href: '#' },
    ],
    Company: [
      { label: 'About Us', href: '#' },
      { label: 'Team', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Blog', href: '#' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms & Conditions', href: '#' },
      { label: 'Refund Policy', href: '#' },
      { label: 'Disclaimer', href: '#' },
    ],
  }

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ]

  return (
    <footer className="bg-dark text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-bg rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">WF</span>
              </div>
              <span className="text-xl font-bold">WPFixHub</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Professional digital marketing agency providing WordPress fixes and web solutions.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-gray-400 hover:text-primary transition-colors duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-primary transition-colors duration-300 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <Mail size={20} className="text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <a
                  href="mailto:info@wp-fixhub.com"
                  className="text-white hover:text-primary transition-colors duration-300"
                >
                  info@wp-fixhub.com
                </a>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Phone size={20} className="text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <a
                  href="tel:+919876543210"
                  className="text-white hover:text-primary transition-colors duration-300"
                >
                  +91-9876543210
                </a>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin size={20} className="text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400">Address</p>
                <p className="text-white">New Delhi, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} WPFixHub. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-4 md:mt-0">
              Made with <span className="text-primary">❤️</span> by WPFixHub Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
