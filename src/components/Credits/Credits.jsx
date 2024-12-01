import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import useUserStore from '../../store/userStore'
import Navbar from '../Navbar/Navbar'
import './Credits.css'
import config from '../../config/config'

function Credits() {
  const navigate = useNavigate();
  const { fetchUserData } = useUserStore();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

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
      credits: 5,
      price: 10,
      amount: 1000,
      description: 'Best for trying out'
    },
    {
      id: 'advanced',
      name: 'Advanced',
      credits: 20,
      price: 50,
      amount: 5000,
      description: 'Best for regular users'
    },
    {
      id: 'business',
      name: 'Business',
      credits: 40,
      price: 100,
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

    setLoading(true);

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
        throw new Error('Failed to create order');
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

            const data = await verifyRes.json();
            if (data.success) {
              await fetchUserData();
              alert('Payment successful! Credits added to your account.');
              navigate('/');
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert('Payment verification failed');
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
      alert('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="credits-page">
      <Navbar />
      
      <div className="credits-container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="credits-header"
        >
          <h1>Choose the plan</h1>
          <p>Select a plan that works best for you</p>
        </motion.div>

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
      </div>
    </div>
  );
}

export default Credits; 