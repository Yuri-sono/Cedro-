import React from 'react';

const EmergencyButton = () => {
  const handleEmergencyCall = () => {
    if (window.confirm('Deseja ligar para o Cedro - (11) 95119-3385?\n\nEm caso de emergência, ligue 188 (CVV).')) {
      window.location.href = 'tel:11951193385';
    }
  };

  return (
    <button
      className="emergency-btn"
      onClick={handleEmergencyCall}
      title="Ligar para Cedro - (11) 95119-3385"
    >
      <i className="bi bi-telephone-fill"></i>
      <span>SOS</span>
    </button>
  );
};

export default EmergencyButton;