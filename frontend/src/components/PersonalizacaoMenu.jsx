import React, { useState, useEffect } from 'react';
import '../styles/personalizacao.css';

const PersonalizacaoMenu = ({ variant = '' }) => {
  // Sufixo único por instância — evita IDs e grupos de radio duplicados no DOM
  // quando o menu é renderizado em mais de um lugar (ex.: navbar desktop + offcanvas).
  const uid = variant ? `-${variant}` : '';
  const [isDark, setIsDark] = useState(false);
  const [colorMode, setColorMode] = useState('padrao');
  const [dyslexiaFont, setDyslexiaFont] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedColorMode = localStorage.getItem('colorMode');
    const savedDyslexiaFont = localStorage.getItem('dyslexiaFont');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    if (savedColorMode && savedColorMode !== 'padrao') {
      setColorMode(savedColorMode);
      document.documentElement.setAttribute('data-daltonismo', savedColorMode);
    }

    if (savedDyslexiaFont === 'true') {
      setDyslexiaFont(true);
      document.documentElement.setAttribute('data-font', 'dislexia');
    }
  }, []);

  const handleThemeChange = (theme) => {
    if (theme === 'dark') {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setIsDark(false);
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

  const handleDyslexiaFontChange = () => {
    const newVal = !dyslexiaFont;
    setDyslexiaFont(newVal);
    if (newVal) {
      document.documentElement.setAttribute('data-font', 'dislexia');
      localStorage.setItem('dyslexiaFont', 'true');
    } else {
      document.documentElement.removeAttribute('data-font');
      localStorage.setItem('dyslexiaFont', 'false');
    }
  };

  return (
    <div className="accordion mt-3 mb-2" id={`accordionPersonalizacao${uid}`}>
      <div className="accordion-item bg-transparent border-0">
        <h2 className="accordion-header" id={`headingPersonalizacao${uid}`}>
          <button className="accordion-button collapsed bg-transparent shadow-none p-2 text-body fw-medium" type="button" data-bs-toggle="collapse" data-bs-target={`#collapsePersonalizacao${uid}`} aria-expanded="false" aria-controls={`collapsePersonalizacao${uid}`} style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem', fontSize: '1rem' }}>
            <i className="bi bi-palette me-2"></i>Personalização
          </button>
        </h2>
        <div id={`collapsePersonalizacao${uid}`} className="accordion-collapse collapse" aria-labelledby={`headingPersonalizacao${uid}`} data-bs-parent={`#accordionPersonalizacao${uid}`}>
          <div className="accordion-body px-2 py-3 border-top mt-2">
            
            <div className="mb-4">
              <h6 className="fw-bold mb-3 text-body" style={{ fontSize: '0.9rem' }}>Temas padrão</h6>
              <div className="form-check mb-3 custom-radio-theme">
                <input className="form-check-input" type="radio" name={`temaPadrao${uid}`} id={`temaClaro${uid}`} checked={!isDark} onChange={() => handleThemeChange('light')} />
                <label className="form-check-label d-flex align-items-center justify-content-between w-100" htmlFor={`temaClaro${uid}`}>
                  <span style={{ fontSize: '0.9rem' }}>Tema padrão</span>
                  <div className="d-flex gap-1 swatches-container">
                     <span className="swatch" style={{ backgroundColor: '#2ca4ec' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#132c44' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#7bc83f' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#f2b52d' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#ea6625' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#de3845' }}></span>
                  </div>
                </label>
              </div>
              <div className="form-check mb-2 custom-radio-theme">
                <input className="form-check-input" type="radio" name={`temaPadrao${uid}`} id={`temaEscuro${uid}`} checked={isDark} onChange={() => handleThemeChange('dark')} />
                <label className="form-check-label d-flex align-items-center justify-content-between w-100" htmlFor={`temaEscuro${uid}`}>
                  <span style={{ fontSize: '0.9rem' }}>Tema escuro</span>
                  <div className="d-flex gap-1 swatches-container">
                     <span className="swatch" style={{ backgroundColor: '#5c5c5c' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#4a4a4a' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#ffffff', border: '1px solid #ccc' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#383838' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#212121' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#141414' }}></span>
                  </div>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <h6 className="fw-bold mb-3 text-body" style={{ fontSize: '0.9rem' }}>Temas de daltonismo</h6>
              <div className="form-check mb-3 custom-radio-theme">
                <input className="form-check-input" type="radio" name={`temaDaltonismo${uid}`} id={`acromatopsia${uid}`} checked={colorMode === 'acromatopsia'} onChange={() => handleColorModeChange('acromatopsia')} />
                <label className="form-check-label d-flex align-items-center justify-content-between w-100" htmlFor={`acromatopsia${uid}`}>
                  <span style={{ fontSize: '0.9rem' }}>Acromatopsia</span>
                  <div className="d-flex gap-1 swatches-container">
                     <span className="swatch" style={{ backgroundColor: '#aaaaaa' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#888888' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#bbbbbb' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#cccccc' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#999999' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#777777' }}></span>
                  </div>
                </label>
              </div>
              <div className="form-check mb-3 custom-radio-theme">
                <input className="form-check-input" type="radio" name={`temaDaltonismo${uid}`} id={`tritanopia${uid}`} checked={colorMode === 'tritanopia'} onChange={() => handleColorModeChange('tritanopia')} />
                <label className="form-check-label d-flex align-items-center justify-content-between w-100" htmlFor={`tritanopia${uid}`}>
                  <span style={{ fontSize: '0.9rem' }}>Tritanopia</span>
                  <div className="d-flex gap-1 swatches-container">
                     <span className="swatch" style={{ backgroundColor: '#00b7ce' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#008394' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#85bbce' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#ff92a1' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#ff546b' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#d94254' }}></span>
                  </div>
                </label>
              </div>
              <div className="form-check mb-3 custom-radio-theme">
                <input className="form-check-input" type="radio" name={`temaDaltonismo${uid}`} id={`deuteranopia${uid}`} checked={colorMode === 'deuteranopia'} onChange={() => handleColorModeChange('deuteranopia')} />
                <label className="form-check-label d-flex align-items-center justify-content-between w-100" htmlFor={`deuteranopia${uid}`}>
                  <span style={{ fontSize: '0.9rem' }}>Deuteranopia</span>
                  <div className="d-flex gap-1 swatches-container">
                     <span className="swatch" style={{ backgroundColor: '#99a8ed' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#213a5a' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#dcb14b' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#e29528' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#b78028' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#a7752b' }}></span>
                  </div>
                </label>
              </div>
              <div className="form-check mb-2 custom-radio-theme">
                <input className="form-check-input" type="radio" name={`temaDaltonismo${uid}`} id={`protanopia${uid}`} checked={colorMode === 'protanopia'} onChange={() => handleColorModeChange('protanopia')} />
                <label className="form-check-label d-flex align-items-center justify-content-between w-100" htmlFor={`protanopia${uid}`}>
                  <span style={{ fontSize: '0.9rem' }}>Protanopia</span>
                  <div className="d-flex gap-1 swatches-container">
                     <span className="swatch" style={{ backgroundColor: '#9ba9ed' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#1c3c5c' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#d4b73b' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#cfb231' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#aa9030' }}></span>
                     <span className="swatch" style={{ backgroundColor: '#9e8533' }}></span>
                  </div>
                </label>
              </div>
              {colorMode !== 'padrao' && (
                <div className="mt-3 text-start">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => handleColorModeChange('padrao')} style={{ fontSize: '0.8rem' }}>Remover filtro</button>
                </div>
              )}
            </div>

            <div>
              <h6 className="fw-bold mb-3 text-body" style={{ fontSize: '0.9rem' }}>Ajuste visual</h6>
              <div className="form-check form-switch custom-switch-theme d-flex align-items-center ps-0">
                <div className="form-switch ps-5 ms-0">
                   <input className="form-check-input fs-5" type="checkbox" role="switch" id={`fonteDislexia${uid}`} checked={dyslexiaFont} onChange={handleDyslexiaFontChange} style={{ marginLeft: '-2.5rem' }} />
                </div>
                <label className="form-check-label ms-1" htmlFor={`fonteDislexia${uid}`} style={{ fontSize: '0.9rem' }}>Fonte tipo dislexia</label>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizacaoMenu;
