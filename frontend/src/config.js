const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:3001' 
    : 'https://cedro-backend-tsyg.onrender.com');

export default API_BASE_URL;