import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import useUserStore from '../../store/userStore'
import Navbar from '../Navbar/Navbar'
import { toast } from 'react-hot-toast'
import './Credits.css'
import { FiHelpCircle } from 'react-icons/fi'
import axios from 'axios'
import config from '../../config/config'

function Credits() {
  const navigate = useNavigate();
  const { fetchUserData } = useUserStore();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
  }, [navigate]);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      credits: 2,
      price: 2,
      amount: 200,
      description: 'Best for trying out'
    },
    {
      id: 'advanced',
      name: 'Advanced',
      credits: 5,
      price: 5,
      amount: 1000,
      description: 'Best for regular users'
    },
    {
      id: 'business',
      name: 'Business',
      credits: 10,
      price: 10,
      amount: 5000,
      description: 'Best for power users'
    }
  ];

  const handlePurchase = async (plan) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to purchase credits');
      navigate('/');
      return;
    }

    setLoading(true);
    try {
      // Create order
      const orderRes = await axios.post(
        `${config.active.apiUrl}/api/credits/create-order`,
        { planId: plan.id },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const { orderId, amount, key } = orderRes.data;

      // Initialize Razorpay
      const options = {
        key,
        amount,
        currency: "INR",
        name: "Imagifine",
        description: `${plan.credits} Credits Purchase`,
        order_id: orderId,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${config.active.apiUrl}/api/credits/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              },
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );

            if (verifyRes.data.success) {
              // Show success message
              toast.success(`Successfully purchased ${plan.credits} credits!`);
              // Show alert and refresh page after OK is clicked
              alert(`Successfully purchased ${plan.credits} credits!`);
              await fetchUserData();
              window.location.reload(); // This will refresh the page
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error(error.response?.data?.message || 'Payment verification failed');
            alert(error.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: {
          email: localStorage.getItem('userEmail') // Add this if you store user email
        },
        notes: {
          planId: plan.id
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            toast.error('Payment cancelled');
            alert('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Order creation error:', error);
      toast.error(
        error.response?.data?.message || 
        'Failed to initialize payment. Please try again.'
      );
      alert(
        error.response?.data?.message || 
        'Failed to initialize payment. Please try again.'
      );
      setLoading(false);
    }
  };

  const handleHelpClick = () => {
    setShowHelpModal(true);
  };

  return (
    <div className="credits-page">
      <Navbar />
      
      <div className="credits-container">
        <div className="credits-header">
          <h1>Choose Your Plan</h1>
          <p>Select a plan that works best for you</p>
          <FiHelpCircle className="help-icon" onClick={handleHelpClick} />
        </div>

        <div className="plans-grid">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className={`plan-card ${selectedPlan?.id === plan.id ? 'selected' : ''}`}
              onClick={() => setSelectedPlan(plan)}
            >
              <div className="plan-header">
                <h2>{plan.name}</h2>
                <p>{plan.description}</p>
              </div>
              
              <div className="plan-price">
                <span className="currency">₹</span>
                <span className="amount">{plan.price}</span>
                <span className="period">/{plan.credits} credits</span>
              </div>

              <button 
                className="purchase-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePurchase(plan);
                }}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Get Started'}
              </button>
            </motion.div>
          ))}
        </div>

        {showHelpModal && (
          <div className="modal-overlay" onClick={() => setShowHelpModal(false)}>
            <div className="help-modal" onClick={e => e.stopPropagation()}>
              <button 
                className="close-button" 
                onClick={() => setShowHelpModal(false)}
              >
                ×
              </button>
              <h2>Need Help?</h2>
              <p>If you have any issues with your payment:</p>
              <ul>
                <li>Make sure you have sufficient balance</li>
                <li>Check if your payment method is enabled for online transactions</li>
                <li>If payment was deducted but credits not received, contact support with your payment ID</li>
              </ul>
              <p><strong>Contact Support:</strong></p>
              <p>Email: sanjusazid@gmailcom</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Credits; 