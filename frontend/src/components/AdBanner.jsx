import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import '../styles/ads.css';

const AdBanner = () => {
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const [adContent, setAdContent] = useState({});

  const ads = [
    {
      title: 'Cuide da sua mente',
      description: 'Agende sua primeira sessão com desconto',
      icon: 'bi-heart-pulse',
      color: '#198754'
    },
    {
      title: 'Meditação guiada',
      description: 'Novos exercícios disponíveis',
      icon: 'bi-headphones',
      color: '#0dcaf0'
    },
    {
      title: 'E-books gratuitos',
      description: 'Baixe materiais sobre saúde mental',
      icon: 'bi-book',
      color: '#6f42c1'
    }
  ];

  useEffect(() => {
    // Não mostrar anúncios se usuário for premium
    if (user?.premium) return;

    const showAd = () => {
      const randomAd = ads[Math.floor(Math.random() * ads.length)];
      setAdContent(randomAd);
      setShow(true);

      setTimeout(() => {
        setShow(false);
      }, 8000);
    };

    const interval = setInterval(showAd, 30000);
    setTimeout(showAd, 5000);

    return () => clearInterval(interval);
  }, [user]);

  if (!show || user?.premium) return null;

  return (
    <div className="ad-banner">
      <button className="ad-close" onClick={() => setShow(false)}>
        <i className="bi bi-x"></i>
      </button>
      <div className="ad-icon" style={{ color: adContent.color }}>
        <i className={`bi ${adContent.icon}`}></i>
      </div>
      <div className="ad-content">
        <h6>{adContent.title}</h6>
        <p>{adContent.description}</p>
      </div>
    </div>
  );
};

export default AdBanner;
