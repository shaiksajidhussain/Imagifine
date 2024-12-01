import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, MenuItem, Divider, ListItemIcon } from '@mui/material'
import { Settings, Logout, Person, CreditCard } from '@mui/icons-material'
import useUserStore from '../../store/userStore'
import './Navbar.css'
import AuthModal from '../Auth/AuthModal'
import config from '../../config/config'

function Navbar() {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const { credits, fetchUserData } = useUserStore()

  // Fetch user data function
  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const response = await fetch(`${config.active.apiUrl}/api/auth/user`, { 
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
          // Update credits in store if needed
          if (userData.credits !== credits) {
            fetchUserData();
          }
        } else {
          localStorage.removeItem('token');
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
        setCurrentUser(null);
      }
    }
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setCurrentUser(null)
    handleMenuClose()
    navigate('/')
    window.location.reload()
  }

  const handleLoginSuccess = async (userData) => {
    if (userData.token) {
      localStorage.setItem('token', userData.token)
      await fetchCurrentUser() // Fetch fresh user data after login
    
    }
  }

  const handleGetStartedClick = () => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/generate') // If already logged in, go to generate page
    } else {
      setIsModalOpen(true) // If not logged in, show login modal
    }
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-content">
        <div className="logo" onClick={() => navigate('/')}>
          Imagi<span>fine</span>
        </div>
        
        {currentUser ? (
          <div className="user-profile">
            <div className="credits">Credits left: {credits}</div>
            <div 
              className="profile-info"
              onClick={handleMenuClick}
            >
              Hi {currentUser.username}
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.username)}&background=random`} 
                alt="Profile" 
                className="avatar"
              />
            </div>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  backgroundColor: '#2a2a2a',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  '& .MuiMenuItem-root': {
                    fontSize: '0.9rem',
                    padding: '10px 20px',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: '#2a2a2a',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                  },
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => navigate('/profile')}>
                <ListItemIcon>
                  <Person sx={{ color: 'white' }} fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={() => navigate('/credits')}>
                <ListItemIcon>
                  <CreditCard sx={{ color: 'white' }} fontSize="small" />
                </ListItemIcon>
                Buy Credits
              </MenuItem>
           
              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout sx={{ color: 'white' }} fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <button 
            className="get-started-btn"
            onClick={handleGetStartedClick}
          >
            Get Started <span className="sparkle">✨</span>
          </button>
        )}
      </div>
      
      <AuthModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </nav>
  )
}

export default Navbar