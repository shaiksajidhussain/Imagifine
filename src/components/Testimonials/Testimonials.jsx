import { Link } from 'react-router-dom'
import './Testimonials.css'

function Testimonials() {
  const testimonials = [
    {
      name: "David Manoj",
      role: "Software Engineer",
      image: "/testimonial1.jpg", 
      rating: 5,
      text: "Imagifine has revolutionized my creative workflow. The AI generates stunning images that serve as perfect inspiration for my digital art projects. The quality and variety are incredible!"
    },
    {
      name: "Praneeth Joshi",
      role: "UI / UX Designer",
      image: "/testimonial2.jpg",
      rating: 5, 
      text: "As a marketing professional, I need high-quality visuals quickly. Imagifine delivers exactly what I need - the AI understands complex prompts and produces professional-grade images in seconds."
    },
    {
      name: "Bharath Reddy",
      role: "Data Analyst",
      image: "/testimonial3.jpg",
      rating: 5,
      text: "I create content daily for multiple social platforms, and Imagifine has become my secret weapon. The image quality is consistently amazing, and the interface is so intuitive to use."
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