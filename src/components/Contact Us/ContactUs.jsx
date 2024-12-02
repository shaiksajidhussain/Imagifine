import { useState } from 'react';
import { FiHelpCircle } from 'react-icons/fi';
import Navbar from '../Navbar/Navbar';
import './ContactUs.css';
import config from '../../config/config';

function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    query: '',
  });
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${config.active.apiUrl}/api/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Thank you for contacting us! We will get back to you soon.');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          query: ''
        });
      } else {
        alert(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Contact submission error:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHelpClick = () => {
    setShowHelpModal(true);
  };

  return (
    <div className="contact-page">
      <Navbar />
      <div className="contact-container">
        <h1>Contact Us</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Any Queries</label>
            <textarea
              name="query"
              value={formData.query}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
        <FiHelpCircle className="help-icon" onClick={handleHelpClick} />

        {/* Help Modal */}
        {showHelpModal && (
          <div className="modal-overlay" onClick={() => setShowHelpModal(false)}>
            <div className="help-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-button" onClick={() => setShowHelpModal(false)}>×</button>
              <h2>Need Free Credits?</h2>
              <p>If you need free credits, mention why in your query. If we are convinced, we will credit them to you.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactUs;