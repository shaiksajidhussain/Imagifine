import { useState } from 'react'
import Modal from 'react-modal'
import './AuthModal.css'

Modal.setAppElement('#root')

function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [showOtpField, setShowOtpField] = useState(false)
  const [userId, setUserId] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    otp: ''
  })
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (isLogin) {
      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const data = await response.json();
        console.log('Login response:', data);
        
        if (response.ok) {
          if (data.token) {
            localStorage.setItem('token', data.token);
            console.log('Token stored:', localStorage.getItem('token'));
            
            onLoginSuccess({ ...data.user, token: data.token });
            onClose();
            setFormData({ email: '', password: '', username: '', otp: '' });
          } else {
            console.error('No token in response:', data);
            alert('Login failed: No token received');
          }
        } else {
          alert(data.message || 'Login failed');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Error during login');
      }
    } else {
      if (showOtpField) {
        // Handle OTP verification
        try {
          const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: userId,
              otp: formData.otp
            })
          });

          const data = await response.json();
          
          if (response.ok) {
            alert('Registration successful! Please login with your credentials');
            setIsLogin(true);
            onClose();
            setFormData({ email: '', password: '', username: '', otp: '' });
            setShowOtpField(false);
          } else {
            alert(data.message || 'OTP verification failed');
          }
        } catch (error) {
          alert('Error during OTP verification');
          console.error(error);
        }
      } else {
        // Handle Registration
        try {
          const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: formData.username,
              email: formData.email,
              password: formData.password
            })
          });

          const data = await response.json();
          
          if (response.ok) {
            setUserId(data.userId);
            setShowOtpField(true);
            alert('Please check your email for OTP');
          } else {
            alert(data.message || 'Registration failed');
          }
        } catch (error) {
          alert('Error during registration');
          console.error(error);
        }
      }
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = async (credentials) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        onLoginSuccess(data);
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    }
  };

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
          <h2>{isLogin ? 'Welcome Back' : (showOtpField ? 'Verify OTP' : 'Create Account')}</h2>
          <p>
            {isLogin 
              ? 'Enter your details to access your account' 
              : (showOtpField ? 'Enter the OTP sent to your email' : 'Start your journey with Imagifine today')}
          </p>
        </div>

        {!showOtpField && (
          <div className="auth-tabs">
            <button 
              className={`tab ${isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(true)
                setFormData({ email: '', password: '', username: '', otp: '' })
              }}
            >
              Login
            </button>
            <button 
              className={`tab ${!isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(false)
                setFormData({ email: '', password: '', username: '', otp: '' })
              }}
            >
              Register
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && !showOtpField && (
            <div className="form-group">
              <input 
                type="text" 
                name="username"
                placeholder="Full Name"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          )}
          
          {!showOtpField && (
            <>
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
            </>
          )}

          {showOtpField && (
            <div className="form-group">
              <input 
                type="text" 
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <button type="submit" className="submit-btn">
            {isLogin ? 'Sign In' : (showOtpField ? 'Verify OTP' : 'Create Account')}
          </button>
        </form>
      </div>
    </Modal>
  )
}

export default AuthModal 
