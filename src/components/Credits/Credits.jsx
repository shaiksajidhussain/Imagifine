import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import useUserStore from '../../store/userStore'
import Navbar from '../Navbar/Navbar'
import './Credits.css'
import config from '../../config/config'
import { FiHelpCircle } from 'react-icons/fi'

function Credits() {
  const navigate = useNavigate();
  const { fetchUserData } = useUserStore();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  useEffect(() => {
    // Check if script is already loaded
    if (document.getElementById('razorpay-script')) {
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.id = 'razorpay-script'; // Add an ID to check for existence
    script.async = true;
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      const existingScript = document.getElementById('razorpay-script');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []); // Empty dependency array as we only want this to run once

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
      price: 10,
      amount: 1000,
      description: 'Best for trying out'
    },
    {
      id: 'advanced',
      name: 'Advanced',
      credits: 5,
      price: 20,
      amount: 5000,
      description: 'Best for regular users'
    },
    {
      id: 'business',
      name: 'Business',
      credits: 10,
      price: 50,
      amount: 10000,
      description: 'Best for power users'
    }
  ];

  const handlePurchase = async (plan) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to purchase credits');
      navigate('/');
      return;
    }

    // Prevent multiple clicks during processing
    if (paymentProcessing) {
      alert('A payment is already in progress. Please wait...');
      return;
    }

    setLoading(true);
    setPaymentProcessing(true);

    try {
      // Create order
      const orderRes = await fetch(`${config.active.apiUrl}/api/credits/create-order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ planId: plan.id })
      });

      if (!orderRes.ok) {
        throw new Error('Failed to create order. Please try again later.');
      }

      const { orderId, amount } = await orderRes.json();

      // Initialize Razorpay
      const options = {
        key: 'rzp_live_8Aw5WIVkdvysi7',
        amount: amount,
        currency: "INR",
        name: "Imagifine",
        description: `${plan.credits} Credits Purchase`,
        order_id: orderId,
        handler: async function (response) {
          try {
            setPaymentId(response.razorpay_payment_id);

            const verifyRes = await fetch(`${config.active.apiUrl}/api/credits/verify-payment`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            if (!verifyRes.ok) {
              throw new Error('Payment verification failed. Please contact support with Payment ID: ' + response.razorpay_payment_id);
            }

            const data = await verifyRes.json();
            if (data.success) {
              await fetchUserData();
              alert('Payment successful! Credits added to your account.');
              navigate('/');
            } else {
              throw new Error('Credits not added. Please contact support with Payment ID: ' + response.razorpay_payment_id);
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert(`Important: Your payment might have been processed but verification failed.\n\n` +
                  `Please save this Payment ID: ${response.razorpay_payment_id}\n\n` +
                  `Contact support immediately with this ID to resolve the issue.\n\n` +
                  `Error: ${error.message}`);
          }
        },
        modal: {
          ondismiss: function() {
            setPaymentProcessing(false);
            setLoading(false);
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#3B82F6"
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Order creation error:', error);
      alert(`Failed to initiate payment: ${error.message}\n\nPlease try again later or contact support if the issue persists.`);
    } finally {
      setLoading(false);
      // Note: paymentProcessing is cleared in modal.ondismiss
    }
  };

  // Add cleanup on component unmount
  useEffect(() => {
    return () => {
      if (paymentId) {
        // Save failed payment ID to localStorage in case component unmounts during processing
        localStorage.setItem('lastFailedPaymentId', paymentId);
      }
    };
  }, [paymentId]);

  const handleHelpClick = () => {
    setShowHelpModal(true);
  };

  return (
    <div className="credits-page">
      <Navbar />
      
      <div className="credits-container">
        <div className="credits-header">
          <h1>Choose the plan</h1>
          <p>Select a plan that works best for you</p>
          <FiHelpCircle className="help-icon" onClick={handleHelpClick} />
        </div>

        <div className="plans-grid">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
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
                onClick={() => handlePurchase(plan)}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Get Started'}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Help Modal */}
        {showHelpModal && (
          <div className="modal-overlay" onClick={() => setShowHelpModal(false)}>
            <div className="help-modal" onClick={e => e.stopPropagation()}>
              <button className="close-button" onClick={() => setShowHelpModal(false)}>×</button>
              <h2>Need Help?</h2>
              <p>If you have paid but the credits haven't appeared, please contact us at:</p>
              <p><strong>Email:</strong> sanjusazid0@gmail.com</p>
              <p>Include your transaction details and transaction ID.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Credits; 