import './ImageGallery.css'

function ImageGallery() {
  const galleryItems = [
    {
      image: 'https://fps.cdnpk.net/images/ai/image-generator/advantages/image-generator-freepik-7.webp?w=1920&h=1920&q=75',
      prompt: "Cyberpunk portrait of a woman with neon lights, futuristic braids, side profile, dark atmosphere with pink and blue hues"
    },
    {
      image: 'https://fps.cdnpk.net/images/ai/image-generator/advantages/image-generator-freepik-6.webp?w=1920&h=1920&q=75',
      prompt: "Macro photography of iridescent snake scales, holographic effect, vibrant colors, extreme close-up with detailed texture"
    },
    {
      image: 'https://fps.cdnpk.net/images/ai/image-generator/tools/image-generator-freepik-1-v3.webp?w=640&h=1920&q=75',
      prompt: "Astronaut portrait series, retro space suit, vintage NASA style, multiple poses, warm lighting"
    },
    {
      image: 'https://fps.cdnpk.net/images/ai/image-generator/gallery/resource-tti-14.webp?w=1920&h=1920&q=90',
      prompt: "Professional surfer riding massive wave, dynamic action shot, inside the barrel, ocean spray, dramatic lighting"
    },
    {
      image: 'https://fps.cdnpk.net/images/ai/image-generator/gallery/resource-tti-13.webp?w=1920&h=1920&q=90',
      prompt: "Fantasy scene of medieval adventurers in a mystical forest, magical glowing atmosphere, ethereal lighting"
    },
    {
      image: 'https://fps.cdnpk.net/images/ai/image-generator/gallery/resource-tti-10.webp?w=1920&h=1920&q=90',
      prompt: "Surreal landscape with giant bioluminescent tree, neon colors, mystical mountain background, sci-fi atmosphere"
    },
    {
      image: 'https://fps.cdnpk.net/images/ai/image-generator/gallery/magnific-robot.webp?w=1920&h=1920&q=90',
      prompt: "Inside a futuristic laboratory, a robot is working on a complex machine, neon lights, high-tech equipment, detailed science lab"
    },
    {
      image: 'https://fps.cdnpk.net/images/ai/image-generator/gallery/resource-tti-16.webp?w=1920&h=1920&q=90',
      prompt: "A Young Asian Anime Girl with long black hair, wearing a red and black striped shirt, blue jeans, and black shoes, holding a red umbrella, standing in a rainy street at night, neon lights, rain, and a red umbrella"
    },


  ]

  return (
    <section className="gallery-section">
      <div className="gallery-container">
        {galleryItems.map((item, index) => (
          <div key={index} className="gallery-item">
            <img 
              src={item.image}
              alt={`AI Generated ${index + 1}`}
              className="gallery-image"
            />
            <div className="prompt-overlay">
              <p className="prompt-text">{item.prompt}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ImageGallery