import React, { useState, useCallback } from 'react';

const Bubble = React.memo(() => {
  const [isPopped, setIsPopped] = useState(false);

  const pop = useCallback(() => {
    if (isPopped) return;
    setIsPopped(true);
    setTimeout(() => {
      setIsPopped(false);
    }, 4000 + Math.random() * 3000);
  }, [isPopped]);

  return (
    <div 
      onClick={pop}
      className={`bubble-wrap-item`}
      style={{
        width: '45px',
        height: '45px',
        borderRadius: '50%',
        backgroundColor: isPopped ? 'transparent' : 'rgba(255, 255, 255, 0.7)',
        border: isPopped ? '1px solid rgba(0,0,0,0.05)' : '2px solid rgba(255, 255, 255, 0.9)',
        boxShadow: isPopped 
          ? 'inset 0 0 10px rgba(0,0,0,0.05)' 
          : 'inset -5px -5px 10px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1)',
        cursor: isPopped ? 'default' : 'pointer',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isPopped ? 'scale(0.9)' : 'scale(1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(2px)',
        position: 'relative',
        willChange: 'transform, background-color, box-shadow'
      }}
    >
      {!isPopped && (
        <div style={{
          width: '12px',
          height: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '50%',
          position: 'absolute',
          top: '8px',
          left: '8px',
          filter: 'blur(1px)'
        }} />
      )}
    </div>
  );
});

const PlasticoBolha = () => {
  const BUBBLE_COUNT = 70; // Adjust for fit

  return (
    <div className="d-flex flex-column align-items-center w-100">
      <h4 className="mb-3 fw-bold text-primary">Plástico Bolha Infinito</h4>
      <p className="text-muted text-center mb-2">Estoure as bolhas para relaxar. Elas vão "encher" novamente depois de alguns segundos!</p>
      <small className="text-warning text-center mb-4">
        <i className="bi bi-exclamation-triangle-fill me-1"></i> 
        Em dispositivos mais fracos, pode haver pequenos travamentos nos primeiros segundos.
      </small>
      
      <div 
        className="d-flex flex-wrap justify-content-center p-4 rounded-4 shadow-sm" 
        style={{ 
          maxWidth: '550px', 
          gap: '12px',
          backgroundColor: 'rgba(25, 135, 84, 0.05)',
          border: '1px solid var(--border-color)'
        }}
      >
        {Array.from({ length: BUBBLE_COUNT }).map((_, index) => (
          <Bubble key={index} />
        ))}
      </div>
    </div>
  );
};

export default PlasticoBolha;
