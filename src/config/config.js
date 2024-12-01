const config = {
  development: {
    apiUrl: 'http://localhost:5000'
  },
  production: {
    apiUrl: 'https://imagifine-backend-mve2.vercel.app'
  },
  active: {
    apiUrl: 'https://imagifine-backend-mve2.vercel.app'  // Change this to switch between development and production
  }
};

export default config; 