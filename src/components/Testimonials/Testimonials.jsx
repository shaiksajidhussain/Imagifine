import { Link } from 'react-router-dom'
import './Testimonials.css'

function Testimonials() {
  const testimonials = [
    {
      name: "Praneeth Joshi",
      role: "UI / UX Designer",
      image: "/testimonial1.jpg",
      rating: 5,
      text: "I've been using Imagifine for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier."
    },
    {
      name: "Bharath Reddy",
      role: "Data Analyst",
      image: "/testimonial2.jpg",
      rating: 5,
      text: "I've been using Imagifine for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier."
    },
    {
      name: "Manoj Shaik",
      role: "Software Engineer",
      image: "/testimonial3.jpg",
      rating: 5,
      text: "I've been using Imagifine for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier."
    }
  ]

  return (
    <section className="testimonials">
      <div className="testimonials-header">
        <h2 className="animate-fade-in">Customer testimonials</h2>
        <p className="animate-fade-in-delay">What Our Users Are Saying</p>
      </div>

      <div className="testimonials-grid">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card animate-slide-up" style={{animationDelay: `${index * 0.2}s`}}>
            <div className="testimonial-content">
       
              <h3>{testimonial.name}</h3>
              <p className="role">{testimonial.role}</p>
              <div className="rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="star">⭐</span>
                ))}
              </div>
              <p className="testimonial-text">{testimonial.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="cta-section animate-fade-in">
        <h2>See the magic. Try now</h2>
        <Link to="/generate">
          <button className="generate-button">
          Generate Images <span className="sparkle">✨</span>
        </button>
        </Link>
      </div>
    </section>
  )
}

export default Testimonials 