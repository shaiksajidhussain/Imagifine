import './CreativeAI.css'

function CreativeAI() {
  return (
    <section className="creative-ai">
      <div className="gradient-overlay"></div>
      <div className="creative-ai-header">
        <h2 className="animate-fade-in">Create AI Images</h2>
        <p className="animate-fade-in-delay">Turn your imagination into visuals</p>
      </div>

      <div className="creative-ai-content">
        <div className="content-image animate-slide-up">
          <img 
            src="https://fps.cdnpk.net/images/ai/image-generator/gallery/pikaso-dog.webp?w=1920&h=1920&q=90" 
            alt="AI Generated Monster Chef" 
            className="feature-image"
          />
        </div>
        
        <div className="content-text animate-slide-up" style={{animationDelay: '0.2s'}}>
          <h3>Introducing the AI-Powered Text to Image Generator</h3>
          
          <p>
            Easily bring your ideas to life with our free AI image generator. Whether you 
            need stunning visuals or unique imagery, our tool transforms your text into 
            eye-catching images with just a few clicks. Imagine it, describe it, and watch it 
            come to life instantly.
          </p>

          <p>
            Simply type in a text prompt, and our cutting-edge AI will generate high-quality 
            images in seconds. From product visuals to character designs and portraits, 
            even concepts that don't yet exist can be visualized effortlessly. Powered by 
            advanced AI technology, the creative possibilities are limitless!
          </p>
        </div>
      </div>
    </section>
  )
}

export default CreativeAI 