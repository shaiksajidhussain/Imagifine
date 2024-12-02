import { motion } from "framer-motion";
import styles from "./FounderProfile.module.css";
import Navbar from "../text-to-image/src/components/Navbar/Navbar";

const FounderProfile = () => {
  return (
    <>
    
 <Navbar/>

    <motion.div 
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className={styles.gradientOverlay} />
      
      <motion.div 
        className={styles.imageContainer}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
      >
        <img 
          src="https://res.cloudinary.com/defsu5bfc/image/upload/v1733168452/snaju_oyur6w.jpg" 
         
          alt="Founder" 
          className={styles.founderImage}
        />
      </motion.div>

      <motion.h1 
        className={styles.name}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Shaik Sajid Hussain
      </motion.h1>

      <motion.p 
        className={styles.title}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Founder & CEO
      </motion.p>

      <motion.div 
        className={styles.socialLinks}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <motion.a 
          href="https://linkedin.com/in/shaiksajidhussain" 
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          LinkedIn
        </motion.a>
        <motion.a 
          href="https://www.instagram.com/sanju__crazy/" 
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Instagram
        </motion.a>
        <motion.a 
          href="https://sanjusazid.vercel.app/" 
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Portfolio
        </motion.a>
      </motion.div>

      <motion.div 
        className={styles.bio}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>
          Hey there! I'm a passionate tech enthusiast and entrepreneur who loves building innovative solutions. As the founder of Imagifine AI, I'm on a mission to democratize AI-powered creativity. When I'm not coding or brainstorming new features, you can find me exploring the latest AI research, mentoring aspiring developers, or dreaming up the next big thing in tech. I believe in the power of technology to transform lives and I'm excited to be part of this AI revolution. Let's create something amazing together! 🚀✨
        </p>
      </motion.div>
    </motion.div>
    </>

  );
};

export default FounderProfile; 