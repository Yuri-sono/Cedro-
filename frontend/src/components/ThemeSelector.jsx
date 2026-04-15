import React, { useState, useEffect } from 'react';

const ThemeSelector = () => {
  const [activeTheme, setActiveTheme] = useState('light');

  const themes = [
    {
      id: 'light',
      name: 'Modo Claro',
      icon: 'bi-sun-fill',
      colors: { bg: '#ffffff', primary: '#0d6efd' },
      dataTheme: 'light',
      dataDaltonismo: null
    },
    {
      id: 'dark',
      name: 'Modo Escuro',
      icon: 'bi-moon-fill',
      colors: { bg: '#212529', primary: '#0d6efd' },
      dataTheme: 'dark',
      dataDaltonismo: null
    },
    {
      id: 'protanopia',
      name: 'Protanopia',
      icon: 'bi-eye-fill',
      colors: { bg: '#ffffff', primary: '#0066cc' },
      dataTheme: 'light',
      dataDaltonismo: 'protanopia'
    },
    {
      id: 'deuteranopia',
      name: 'Deuteranopia',
      icon: 'bi-eye-fill',
      colors: { bg: '#ffffff', primary: '#0073e6' },
      dataTheme: 'light',
      dataDaltonismo: 'deuteranopia'
    },
    {
      id: 'tritanopia',
      name: 'Tritanopia',
      icon: 'bi-eye-fill',
      colors: { bg: '#ffffff', primary: '#cc0066' },
      dataTheme: 'light',
      dataDaltonismo: 'tritanopia'
    }
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedDaltonismo = localStorage.getItem('daltonismo');
    
    const themeId = savedDaltonismo || savedTheme;
    setActiveTheme(themeId);
    applyTheme(themeId);
  }, []);

  const applyTheme = (themeId) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;

    const root = document.documentElement;
    
    root.setAttribute('data-theme', theme.dataTheme);
    
    if (theme.dataDaltonismo) {
      root.setAttribute('data-daltonismo', theme.dataDaltonismo);
      localStorage.setItem('daltonismo', theme.dataDaltonismo);
      localStorage.setItem('theme', theme.dataTheme);
    } else {
      root.removeAttribute('data-daltonismo');
      localStorage.removeItem('daltonismo');
      localStorage.setItem('theme', theme.dataTheme);
    }
  };

  const handleThemeChange = (themeId) => {
    setActiveTheme(themeId);
    applyTheme(themeId);
  };

  return (
    <div className="theme-selector">
      <h5 className="mb-3">Tema e Acessibilidade</h5>
      <div className="row g-3">
        {themes.map(theme => (
          <div key={theme.id} className="col-6 col-md-4">
            <div
              className={`theme-card ${activeTheme === theme.id ? 'active' : ''}`}
              onClick={() => handleThemeChange(theme.id)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleThemeChange(theme.id)}
            >
              {activeTheme === theme.id && (
                <div className="theme-check">
                  <i className="bi bi-check-circle-fill"></i>
                </div>
              )}
              <div className="theme-preview">
                <div className="preview-circle" style={{ backgroundColor: theme.colors.bg, border: '2px solid #dee2e6' }}></div>
                <div className="preview-circle" style={{ backgroundColor: theme.colors.primary }}></div>
              </div>
              <div className="theme-info">
                <i className={`bi ${theme.icon} me-2`}></i>
                <span>{theme.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
