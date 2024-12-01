import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="video-background">
        <div className="overlay"></div>
        <video autoPlay loop muted playsInline>
          <source src="https://res.cloudinary.com/defsu5bfc/video/upload/v1733042798/prompting_7_rmcwjy.mp4" type="video/mp4" />
        </video>
      </div>

      <nav className="nav">
        <div className="logo">
          Imagi<span>fine</span>
        </div>
        <button className="nav-button">Get Started</button>
      </nav>
      
      <div className="hero">
        <h1 className="hero-title">
          Turn text to <span className="highlight">image</span> in seconds.
        </h1>
        <p className="subtitle">Create stunning AI-generated images from text descriptions instantly</p>
        <button className="primary-button">Generate Images</button>
      </div>
    </header>
  )
}

export default Header