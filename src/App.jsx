import { useState, useEffect } from 'react'
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  useNavigate 
} from 'react-router-dom'
import AuthModal from './components/Auth/AuthModal'
import CreativeAI from './components/CreativeAI/CreativeAI'
import Header from './components/Header/Header'
import HowItWorks from './components/HowItWorks/HowItWorks'
import ImageGallery from './components/ImageGallery/ImageGallery'
import Testimonials from './components/Testimonials/Testimonials'
import ImageGenerator from './components/ImageGenerator/ImageGenerator'
import Credits from './components/Credits/Credits'
import Navbar from './components/Navbar/Navbar'
import Gemini from './components/Gemini/Gemini'

// import TextInpainting from './components/TextInpainting/TextInpainting'
import ReplaceBackground from './components/ReplaceBackground/ReplaceBackground'

import './styles/globals.css'
import ContactUs from './components/Contact Us/ContactUs'
import FounderProfile from './components/Founder Profile/FounderProfile'
import TransactionHistory from './components/TransactionHistory'


// Create a wrapper component that has access to navigation
function AppContent() {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLoginSuccess = (userData) => {
    console.log('Login success data:', userData);
    
    if (userData.token) {
      localStorage.setItem('token', userData.token);
      setIsAuthenticated(true);
      setShowAuthModal(false);
      window.location.href = '/generate';
    } else {
      console.error('No token in login success data');
    }
  }

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

  const UnauthorizedRedirect = () => {
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        setShowAuthModal(true);
      }
    }, []);
    
    return <Navigate to="/" replace />;
  }

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return <UnauthorizedRedirect />;
    }
    return (
      <>
        <Navbar />
        {children}
      </>
    );
  };

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/generate" 
          element={
            <ProtectedRoute>
              <ImageGenerator />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/credits" 
          element={
            <ProtectedRoute>
              <Credits />
            </ProtectedRoute>
          }
        />
        <Route path="/imagifine" element={<Gemini />} />
        <Route path="/contact-us" element={<ContactUs />} />
        
        <Route path="/replace-background" element={<ReplaceBackground />} />
        <Route path="/founder-profile" element={<FounderProfile />} />
        <Route path="/transaction-history" element={<TransactionHistory />} />
      </Routes>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  )
}

// Main App component
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App