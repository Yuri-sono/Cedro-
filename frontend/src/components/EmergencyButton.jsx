import React, { useState } from 'react';

// Números oficiais de socorro no Brasil
const NUMEROS_SOCORRO = [
  {
    nome: 'CVV — Centro de Valorização da Vida',
    numero: '188',
    desc: 'Apoio emocional e prevenção ao suicídio · 24h · gratuito',
    tel: '188',
    classe: 'sos-cvv',
    icone: 'bi-heart-pulse'
  },
  { nome: 'SAMU', numero: '192', desc: 'Emergência médica / ambulância', tel: '192', classe: 'sos-samu', icone: 'bi-ambulance' },
  { nome: 'Polícia Militar', numero: '190', desc: 'Emergência policial', tel: '190', classe: 'sos-policia', icone: 'bi-shield' },
  { nome: 'Corpo de Bombeiros', numero: '193', desc: 'Incêndios e resgates', tel: '193', classe: 'sos-bombeiros', icone: 'bi-fire' }
];

const EmergencyButton = () => {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="emergency-wrapper">
      {aberto && (
        <>
          <div className="sos-overlay" onClick={() => setAberto(false)} />
          <div className="sos-popover" role="dialog" aria-label="Números de emergência">
            <div className="sos-popover-header">
              <h6 className="mb-0">
                <i className="bi bi-telephone-outbound me-2"></i>
                Precisa de ajuda agora?
              </h6>
              <button
                type="button"
                className="btn-close btn-close-white btn-sm"
                aria-label="Fechar"
                onClick={() => setAberto(false)}
              ></button>
            </div>

            <a href="tel:188" className="sos-item sos-cvv-item" onClick={() => setAberto(false)}>
              <span className="sos-icone"><i className="bi bi-heart-pulse"></i></span>
              <span className="flex-grow-1">
                <strong>CVV — Ligue 188</strong>
                <small className="d-block">Apoio emocional gratuito, sigiloso e 24 horas por dia</small>
              </span>
              <i className="bi bi-telephone-fill"></i>
            </a>

            <div className="sos-divider">Outros serviços de emergência</div>

            {NUMEROS_SOCORRO.filter(n => n.numero !== '188').map((n) => (
              <a key={n.numero} href={`tel:${n.tel}`} className="sos-item" onClick={() => setAberto(false)}>
                <span className={`sos-icone ${n.classe}`}><i className={`bi ${n.icone}`}></i></span>
                <span className="flex-grow-1">
                  <strong>{n.nome} — {n.numero}</strong>
                  <small className="d-block">{n.desc}</small>
                </span>
                <i className="bi bi-telephone-fill text-muted"></i>
              </a>
            ))}

            <p className="sos-nota mb-0">
              <i className="bi bi-shield-exclamation me-1"></i>
              Em risco imediato, ligue 188 ou vá ao pronto-socorro mais próximo.
            </p>
          </div>
        </>
      )}

      <button
        type="button"
        className={`emergency-btn ${aberto ? 'aberto' : ''}`}
        onClick={() => setAberto(a => !a)}
        title="Números de emergência — CVV 188"
        aria-expanded={aberto}
      >
        <i className={`bi ${aberto ? 'bi-x-lg' : 'bi-telephone-fill'}`}></i>
        <span>SOS</span>
      </button>
    </div>
  );
};

export default EmergencyButton;