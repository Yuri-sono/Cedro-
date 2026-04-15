import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  const [colorMode, setColorMode] = useState('padrao');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedColorMode = localStorage.getItem('colorMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    if (savedColorMode && savedColorMode !== 'padrao') {
      setColorMode(savedColorMode);
      document.documentElement.setAttribute('data-daltonismo', savedColorMode);
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

  const handleColorModeChange = (mode) => {
    setColorMode(mode);
    
    if (mode === 'padrao') {
      document.documentElement.removeAttribute('data-daltonismo');
      localStorage.removeItem('colorMode');
    } else {
      document.documentElement.setAttribute('data-daltonismo', mode);
      localStorage.setItem('colorMode', mode);
    }
  };

  const colorModes = [
    { value: 'padrao', label: 'Padrão', icon: 'bi-palette' },
    { value: 'protanopia', label: 'Protanopia', icon: 'bi-eye' },
    { value: 'deuteranopia', label: 'Deuteranopia', icon: 'bi-eye' },
    { value: 'tritanopia', label: 'Tritanopia', icon: 'bi-eye' }
  ];

  return (
    <div className="dropdown">
      <button 
        className="btn btn-link text-white dropdown-toggle"
        type="button"
        id="accessibilityMenu"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        title="Acessibilidade"
      >
        <i className="bi bi-universal-access"></i>
      </button>
      <ul className="dropdown-menu dropdown-menu-end p-3" aria-labelledby="accessibilityMenu" style={{ minWidth: '280px' }}>
        <li className="mb-3">
          <h6 className="dropdown-header px-0">
            <i className="bi bi-brightness-high me-2"></i>
            Tema
          </h6>
          <div className="d-flex align-items-center justify-content-between px-3">
            <span className="small">{isDark ? 'Modo Escuro' : 'Modo Claro'}</span>
            <div className="form-check form-switch">
              <input 
                className="form-check-input" 
                type="checkbox" 
                role="switch"
                id="darkModeSwitch"
                checked={isDark}
                onChange={toggleTheme}
              />
            </div>
          </div>
        </li>
        <li><hr className="dropdown-divider" /></li>
        <li>
          <h6 className="dropdown-header px-0">
            <i className="bi bi-palette me-2"></i>
            Modo de Cor
          </h6>
          <div className="px-3">
            {colorModes.map((mode) => (
              <div className="form-check mb-2" key={mode.value}>
                <input 
                  className="form-check-input" 
                  type="radio" 
                  name="colorMode"
                  id={`colorMode-${mode.value}`}
                  value={mode.value}
                  checked={colorMode === mode.value}
                  onChange={() => handleColorModeChange(mode.value)}
                />
                <label className="form-check-label small" htmlFor={`colorMode-${mode.value}`}>
                  <i className={`${mode.icon} me-1`}></i>
                  {mode.label}
                </label>
              </div>
            ))}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default React.memo(ThemeToggle);