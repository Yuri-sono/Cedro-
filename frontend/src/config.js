const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:8080' 
    : 'https://cedro-vc32.onrender.com');

export default API_BASE_URL;