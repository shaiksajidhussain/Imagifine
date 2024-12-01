import { useState } from 'react'
import Modal from 'react-modal'
import './AuthModal.css'

Modal.setAppElement('#root') // Set the root element for accessibility

function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (isLogin) {
      // Login Logic
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const user = users.find(u => u.email === formData.email && u.password === formData.password)
      
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user))
        onLoginSuccess(user)
        onClose()
        setFormData({ email: '', password: '', name: '' }) // Clear form
      } else {
        alert('Invalid credentials')
      }
    } else {
      // Register Logic
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      
      if (users.some(user => user.email === formData.email)) {
        alert('Email already registered')
        return
      }

      const newUser = {
        id: Date.now(),
        ...formData
      }

      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))
      
      // Instead of auto-login, switch to login tab and show success message
      alert('Registration successful! Please login with your credentials.')
      setIsLogin(true) // Switch to login tab
      setFormData({ email: '', password: '', name: '' }) // Clear form
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="auth-modal"
      overlayClassName="modal-overlay"
    >
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>
            {isLogin 
              ? 'Enter your details to access your account' 
              : 'Start your journey with Imagifine today'}
          </p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`tab ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(true)
              setFormData({ email: '', password: '', name: '' }) // Clear form on tab switch
            }}
          >
            Login
          </button>
          <button 
            className={`tab ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(false)
              setFormData({ email: '', password: '', name: '' }) // Clear form on tab switch
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <input 
                type="text" 
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <input 
              type="email" 
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <input 
              type="password" 
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </Modal>
  )
}

export default AuthModal 
