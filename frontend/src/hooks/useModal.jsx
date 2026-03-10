import { useState } from 'react';

export const useModal = () => {
  const [modal, setModal] = useState({ show: false, title: '', message: '', type: 'info', onConfirm: null });

  const showAlert = (message, title = 'Aviso', type = 'info') => {
    return new Promise((resolve) => {
      setModal({
        show: true,
        title,
        message,
        type,
        onConfirm: () => {
          setModal({ show: false, title: '', message: '', type: 'info', onConfirm: null });
          resolve(true);
        }
      });
    });
  };

  const showConfirm = (message, title = 'Confirmação') => {
    return new Promise((resolve) => {
      setModal({
        show: true,
        title,
        message,
        type: 'confirm',
        onConfirm: () => {
          setModal({ show: false, title: '', message: '', type: 'info', onConfirm: null });
          resolve(true);
        },
        onCancel: () => {
          setModal({ show: false, title: '', message: '', type: 'info', onConfirm: null });
          resolve(false);
        }
      });
    });
  };

  const closeModal = () => {
    if (modal.onCancel) {
      modal.onCancel();
    } else {
      setModal({ show: false, title: '', message: '', type: 'info', onConfirm: null });
    }
  };

  return { modal, showAlert, showConfirm, closeModal };
};
