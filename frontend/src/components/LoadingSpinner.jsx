import React from 'react';

const LoadingSpinner = ({ size = 'md', fullScreen = false, message = 'Carregando...' }) => {
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg'
  };

  if (fullScreen) {
    return (
      <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
           style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
        <div className="text-center">
          <div className={`spinner-border text-primary ${sizeClasses[size]}`} role="status">
            <span className="visually-hidden">{message}</span>
          </div>
          <p className="text-white mt-3">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-4">
      <div className={`spinner-border text-primary ${sizeClasses[size]}`} role="status">
        <span className="visually-hidden">{message}</span>
      </div>
      {message && <p className="text-muted mt-2">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
