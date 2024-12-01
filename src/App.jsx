import CreativeAI from './components/CreativeAI/CreativeAI'
import Header from './components/Header/Header'
import HowItWorks from './components/HowItWorks/HowItWorks'
import ImageGallery from './components/ImageGallery/ImageGallery'
import Testimonials from './components/Testimonials/Testimonials'
import './styles/globals.css'


function App() {
  return (
    <div className="app">
      <Header />
      <ImageGallery/>
      <HowItWorks/>
      <CreativeAI/>
      <Testimonials/>

      {/* <ImageGallery />
      <HowItWorks />
      <CreativeAI />
      <Testimonials />
      <Footer /> */}
    </div>
  )
}

export default App