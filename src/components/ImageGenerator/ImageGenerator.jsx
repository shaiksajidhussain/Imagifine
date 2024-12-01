import { useState, useEffect } from 'react'
import { FiDownload, FiImage } from 'react-icons/fi'
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
  
  const { credits, fetchUserData, updateCredits } = useUserStore()
  
  const API_KEY = 'c43e415ba9eafc78d847a58eda7a57af9e1aa597408b1252be2d066fc6da1b063f23fa1db1e5601c348a1f03160b3b80'

  useEffect(() => {
    fetchUserData()
  }, [])

  const generateImage = async () => {
    if (credits <= 0) {
      setError('Not enough credits! Please purchase more credits to continue.')
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
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to create..."
              className="prompt-input"
              maxLength={1000}
            />
            <button
              onClick={generateImage}
              disabled={loading || !prompt || credits <= 0}
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
    </div>
  )
}

export default ImageGenerator 