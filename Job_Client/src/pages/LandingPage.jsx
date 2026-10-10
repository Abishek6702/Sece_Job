import React from 'react'
import About from '../components/About'
import ClientFeedback from '../components/ClientFeedback'
import ContactUs from '../components/ContactUs'
import FooterLanding from '../components/FooterLanding'
// import Services from '../components/Services'
// import Blogs from '../components/Blogs'
import LandingNavbar from '../components/LandingNavbar'
import Hero from '../components/Hero'
import LandingCarousel from '../components/LandingCarousel'

const LandingPage = () => {
  return (
    
    <>
    <LandingNavbar/>
    <Hero/>
    <LandingCarousel/>
    <About/>
    {/* <Services/> */}
    <ClientFeedback/>
    {/* <Blogs/> */}
    <ContactUs/>
    
    <FooterLanding/>
    
    </>
  )
}

export default LandingPage