import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AuthModal from './components/Auth/AuthModal'
import CreativeAI from './components/CreativeAI/CreativeAI'
import Header from './components/Header/Header'
import HowItWorks from './components/HowItWorks/HowItWorks'
import ImageGallery from './components/ImageGallery/ImageGallery'
import Testimonials from './components/Testimonials/Testimonials'
import ImageGenerator from './components/ImageGenerator/ImageGenerator'
import Navbar from './components/Navbar/Navbar'

import './styles/globals.css'

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const isAuthenticated = !!localStorage.getItem('currentUser')

  const LandingPage = () => (
    <>
      <Navbar />
      <Header />
      <ImageGallery />
      <HowItWorks />
      <CreativeAI />
      <Testimonials />
    </>
  )

  const handleLoginSuccess = (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user))
    setShowAuthModal(false)
    window.location.href = '/generate'
  }

  const UnauthorizedRedirect = () => {
    useEffect(() => {
      setShowAuthModal(true)
    }, [])
    
    return <Navigate to="/" replace />
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/generate" 
            element={
              isAuthenticated ? (
                <ImageGenerator />
              ) : (
                <UnauthorizedRedirect />
              )
            } 
          />
        </Routes>

        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </Router>
  )
}

export default App