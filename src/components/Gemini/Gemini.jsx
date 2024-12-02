import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Navbar from '../Navbar/Navbar';
import './Gemini.css';

function Gemini() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const genAI = new GoogleGenerativeAI('AIzaSyBXHpky88CQEP-7LRrYLuVGfV1v4YLE6MQ');

  const generateResponse = async () => {
    try {
      setLoading(true);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setResponse(text);
    } catch (error) {
      console.error('Error:', error);
      setResponse('An error occurred while generating the response.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(response);
      alert('Response copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="gemini-page">
      <Navbar />
      <div className="gemini-container">
        <div className="input-section">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to generate..."
            rows={4}
          />
          <button 
            className="generate-button"
            onClick={generateResponse}
            disabled={loading || !prompt}
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>

        {response && (
          <div className="response-section">
            <div className="response-header">
              <h2>Response</h2>
              <button className="copy-button" onClick={copyToClipboard}>
                Copy
              </button>
            </div>
            <div className="response-content">
              {response}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Gemini; 