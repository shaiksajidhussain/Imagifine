import './HowItWorks.css'

function HowItWorks() {
  const steps = [
    {
      icon: "📝",
      title: "Describe Your Vision",
      description: "Start by describing the image you want to create in natural language."
    },
    {
      icon: "🎨",
      title: "Watch the Magic",
      description: "Our AI processes your text and generates unique, creative images instantly."
    },
    {
      icon: "⬇️",
      title: "Download & Share",
      description: "Download your generated images in high quality and share them with the world."
    }
  ]

  return (
    <section className="how-it-works">
      <div className="section-header">
        <h2>How it works</h2>
        <p>Turn your imagination into visuals</p>
      </div>
      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={index} className="step-card">
            <div className="step-icon">{step.icon}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HowItWorks