import { useState, useEffect } from 'react'
import { FiDownload, FiImage, FiHelpCircle } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import useUserStore from '../../store/userStore'
import Navbar from '../Navbar/Navbar'
import './ImageGenerator.css'

function ImageGenerator() {
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [showCreditModal, setShowCreditModal] = useState(false)
  
  const { credits, fetchUserData, updateCredits } = useUserStore()
  
  const API_KEY = '18c75e9972fc57cc0d65729103c74baeddd1ac312737856c01e1495b65770f383e0b082ad2ba5f7fc99185d48d6c834c'

  useEffect(() => {
    fetchUserData()
  }, [])

  const generateImage = async () => {
    if (credits <= 0) {
      setShowCreditModal(true)
      return
    }

    setLoading(true)
    setError(null)
    setImageUrl('')

    try {
      // First, try to update credits
      const newCredits = credits - 1
      const updateResponse = await updateCredits(newCredits)
      
      if (!updateResponse) {
        throw new Error('Failed to update credits')
      }

      // Then proceed with image generation
      const form = new FormData()
      form.append('prompt', prompt)

      const response = await fetch(
        "https://clipdrop-api.co/text-to-image/v1",
        {
          method: "POST",
          headers: {
            "x-api-key": API_KEY,
          },
          body: form,
        }
      )

      if (!response.ok) {
        // If image generation fails, restore the credit
        await updateCredits(credits)
        throw new Error('Failed to generate image')
      }

      const buffer = await response.arrayBuffer()
      const blob = new Blob([buffer])
      const imageUrl = URL.createObjectURL(blob)
      setImageUrl(imageUrl)

    } catch (err) {
      setError('Error: ' + err.message)
      // If any error occurs, ensure we refresh the credit count
      await fetchUserData()
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `${prompt.slice(0, 30)}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  const handleHelpClick = () => {
    window.open('/imagifine', '_blank');
  };

  const handleBuyCredits = () => {
    navigate('/credits')
  }

  const handleGenerateClick = () => {
    if (credits <= 0) {
      setShowCreditModal(true)
      return
    }
    generateImage()
  }

  return (
    <div className="generator-page">
      <Navbar />
      
      {/* Main Content */}
      <section className="image-generator">
        <div className="gradient-overlay"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="generator-container"
        >
          <div className="credits-display">
            Credits remaining: {credits}
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="input-container"
          >
            <div className="prompt-container">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to create..."
                className="prompt-input"
                maxLength={1000}
              />
              <div className="help-tooltip">
                <FiHelpCircle 
                  className="help-icon" 
                  onClick={handleHelpClick}
                />
                <span className="tooltip-text">Need help with prompts? Ask AI</span>
              </div>
            </div>
            <button
              onClick={handleGenerateClick}
              disabled={loading || !prompt}
              className="generate-button"
            >
              {loading ? (
                <div className="loader"></div>
              ) : (
                <>
                  <FiImage /> Generate
                </>
              )}
            </button>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="error-message"
            >
              {error}
            </motion.div>
          )}

          {imageUrl && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="result-container"
            >
              <div className="image-wrapper">
                <img 
                  src={imageUrl} 
                  alt={prompt} 
                  className="generated-image"
                  onClick={toggleFullScreen} 
                />
                <button onClick={handleDownload} className="download-button">
                  <FiDownload /> 
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Full Screen Modal */}
      {isFullScreen && (
        <div className="image-modal" onClick={toggleFullScreen}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={toggleFullScreen}>×</button>
            <img 
              src={imageUrl} 
              alt={prompt} 
              className="modal-image"
            />
            <p className="modal-prompt">{prompt}</p>
          </div>
        </div>
      )}

      {/* Credit Purchase Modal */}
      {showCreditModal && (
        <div className="modal-overlay" onClick={() => setShowCreditModal(false)}>
          <div className="credit-modal" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={() => setShowCreditModal(false)}>×</button>
            <h2>Out of Credits</h2>
            <p>You've run out of credits. Would you like to purchase more to continue generating images?</p>
            <div className="modal-buttons">
              <button className="cancel-button" onClick={() => setShowCreditModal(false)}>
                Cancel
              </button>
              <button className="buy-credits-button" onClick={handleBuyCredits}>
                Buy Credits
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageGenerator 