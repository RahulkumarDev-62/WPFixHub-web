import React from 'react'
import { Star } from 'lucide-react'

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'John Doe',
      company: 'Tech Startup',
      image: 'https://via.placeholder.com/80x80?text=John',
      text: 'WPFixHub transformed our WordPress site. The team was professional and delivered beyond expectations!',
      rating: 5,
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      company: 'E-commerce Business',
      image: 'https://via.placeholder.com/80x80?text=Sarah',
      text: 'Excellent digital marketing strategies. Our sales increased by 150% within 3 months!',
      rating: 5,
    },
    {
      id: 3,
      name: 'Mike Chen',
      company: 'Digital Agency',
      image: 'https://via.placeholder.com/80x80?text=Mike',
      text: 'The security solutions provided by WPFixHub gave us peace of mind. Highly recommended!',
      rating: 5,
    },
    {
      id: 4,
      name: 'Emma Wilson',
      company: 'Fashion Brand',
      image: 'https://via.placeholder.com/80x80?text=Emma',
      text: 'Outstanding UI/UX design work. Our website looks amazing and converts better than ever!',
      rating: 5,
    },
  ]

  return (
    <section className="py-20 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slideUp">
          <h2 className="text-4xl lg:text-5xl font-bold text-dark mb-4">
            What Our <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Clients Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real feedback from satisfied customers
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-8 card-shadow hover-lift transition-all duration-300 animate-slideUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Stars */}
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>

              {/* Author */}
              <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-dark">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
