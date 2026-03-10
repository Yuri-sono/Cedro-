import React from 'react';
import '../styles/custom-modal.css';

const CustomModal = ({ show, title, message, type, onConfirm, onCancel }) => {
  if (!show) return null;

  const isConfirm = type === 'confirm';

  return (
    <div className="custom-modal-overlay" onClick={onCancel}>
      <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="custom-modal-header">
          <i className={`bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : type === 'confirm' ? 'question-circle' : 'info-circle'}`}></i>
          <h5>{title}</h5>
        </div>
        <div className="custom-modal-body">
          <p>{message}</p>
        </div>
        <div className="custom-modal-footer">
          {isConfirm ? (
            <>
              <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
              <button className="btn btn-danger" onClick={onConfirm}>Confirmar</button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={onConfirm}>OK</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
