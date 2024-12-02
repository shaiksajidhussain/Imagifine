import { useState, useEffect } from 'react';
import { FiDownload, FiImage } from 'react-icons/fi';
import { motion } from 'framer-motion';
import useUserStore from '../../store/userStore';
import Navbar from '../Navbar/Navbar';
import './ReplaceBackground.css';

function ReplaceBackground() {
  const [imageFile, setImageFile] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  const { credits, fetchUserData, updateCredits } = useUserStore();
  const API_KEY = 'c43e415ba9eafc78d847a58eda7a57af9e1aa597408b1252be2d066fc6da1b063f23fa1db1e5601c348a1f03160b3b80';

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!imageFile) {
      setError('Please provide an image');
      return;
    }

    if (credits <= 0) {
      setError('Not enough credits! Please purchase more credits to continue.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // First, try to update credits
      const newCredits = credits - 1;
      const updateResponse = await updateCredits(newCredits);
      
      if (!updateResponse) {
        throw new Error('Failed to update credits');
      }

      // Then proceed with background replacement
      const formData = new FormData();
      formData.append('image_file', imageFile);
      formData.append('prompt', prompt);

      const response = await fetch('https://clipdrop-api.co/replace-background/v1', {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        // If image generation fails, restore the credit
        await updateCredits(credits);
        throw new Error('Failed to replace background');
      }

      const blob = await response.blob();
      setResult(URL.createObjectURL(blob));

    } catch (err) {
      setError('Error: ' + err.message);
      // If any error occurs, ensure we refresh the credit count
      await fetchUserData();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="replace-background-page">
      <Navbar />
      <div className="replace-background-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="generator-container"
        >
          <div className="credits-display">
            Credits remaining: {credits}
          </div>

          <div className="input-section">
            <div className="file-input-group">
              <label>Image File</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <img src={imagePreview} alt="Original" className="preview-image" />
              )}
            </div>

            <div className="text-input-group">
              <label>Background Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the new background..."
                rows={4}
              />
            </div>

            <button 
              className="generate-button"
              onClick={handleSubmit}
              disabled={loading || !imageFile || credits <= 0}
            >
              {loading ? (
                <div className="loader"></div>
              ) : (
                <>
                  <FiImage /> Generate
                </>
              )}
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="error-message"
            >
              {error}
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="result-container"
            >
              <div className="result-preview" onClick={() => setShowModal(true)}>
                <img src={result} alt="Result" className="result-preview-image" />
                <div className="download-overlay">
                  <a 
                    href={result} 
                    download="background-replaced.jpg"
                    onClick={(e) => e.stopPropagation()}
                    className="download-icon"
                  >
                    <FiDownload />
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal-content">
                <button className="close-button" onClick={() => setShowModal(false)}>×</button>
                <img src={result} alt="Result" className="modal-image" />
                <p className="modal-prompt">{prompt}</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default ReplaceBackground; 