import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
      title={isDark ? 'Modo Claro' : 'Modo Escuro'}
    >
      <div className="theme-toggle-track">
        <div className="theme-toggle-thumb">
          <i className={`bi ${isDark ? 'bi-moon-stars' : 'bi-sun'}`}></i>
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;