import React from 'react'
import Navbar from '../components/Common/Navbar'
import Footer from '../components/Common/Footer'
import Hero from '../components/Landing/Hero'
import Services from '../components/Landing/Services'
import Team from '../components/Landing/Team'
import Testimonials from '../components/Landing/Testimonials'
import CTA from '../components/Landing/CTA'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Services />
      <Team />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  )
}

export default HomePage
