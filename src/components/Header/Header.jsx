import './Header.css'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="header">
      <div className="video-background">
        <div className="overlay"></div>
        <video autoPlay loop muted playsInline>
          <source src="https://res.cloudinary.com/defsu5bfc/video/upload/v1733042798/prompting_7_rmcwjy.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="hero">
        <h1 className="hero-title">
          Turn text to <span className="highlight">image</span> in seconds.
        </h1>
        <p className="subtitle">Create stunning AI-generated images from text descriptions instantly</p>
        <Link to="/generate"><button className="primary-button generate-images-btn">Generate Images</button></Link>
      </div>
    </header>
  )
}

export default Header