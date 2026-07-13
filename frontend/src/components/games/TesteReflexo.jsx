import React, { useState, useRef, useEffect } from 'react';

const TesteReflexo = () => {
  const [gameState, setGameState] = useState('idle');
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(null);
  const timeoutRef = useRef(null);

  const startGame = () => {
    setGameState('waiting');
    setReactionTime(null);
    
    const delay = 2000 + Math.random() * 4000;
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      setGameState('ready');
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = (e) => {
    // Anti-cheat: verifica se o clique foi feito por um usuário real e não via script
    if (e && !e.isTrusted) {
      alert("⚠️ Trapaça detectada: O uso de scripts não é permitido!");
      setGameState('idle');
      return;
    }

    if (gameState === 'idle' || gameState === 'result' || gameState === 'too-early') {
      startGame();
    } else if (gameState === 'waiting') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setGameState('too-early');
    } else if (gameState === 'ready') {
      const endTime = Date.now();
      const time = endTime - startTime;
      
      // Anti-cheat: Limite físico humano (recorde mundial é ~100ms).
      // Menos de 50ms é matematicamente impossível para um humano, indicando bot/script.
      if (time < 50) {
        alert(`⚠️ Trapaça detectada: Tempo de ${time}ms é humanamente impossível!`);
        setGameState('idle');
        return;
      }

      setReactionTime(time);
      setGameState('result');
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getBackgroundColor = () => {
    switch (gameState) {
      case 'waiting': return '#dc3545';
      case 'ready': return '#198754';
      case 'too-early': return '#fd7e14';
      case 'result': return '#0d6efd';
      default: return 'var(--card-bg)';
    }
  };

  const getMessage = () => {
    switch (gameState) {
      case 'waiting': return 'Aguarde a cor mudar para verde...';
      case 'ready': return 'CLIQUE JÁ!';
      case 'too-early': return 'Ops! Você clicou muito cedo. Clique para tentar novamente.';
      case 'result': return `Seu tempo: ${reactionTime} ms. Clique para jogar novamente.`;
      default: return 'Clique aqui para começar';
    }
  };

  const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';

  return (
    <div className="d-flex flex-column align-items-center w-100">
      <h4 className="mb-3 fw-bold text-primary">Teste de Reflexo</h4>
      <p className="text-muted text-center mb-4">Mantenha a concentração. Assim que a tela ficar verde, clique o mais rápido que puder!</p>
      
      <div 
        onClick={handleClick}
        className="d-flex align-items-center justify-content-center text-center shadow-sm"
        style={{
          width: '100%',
          maxWidth: '600px',
          height: '350px',
          backgroundColor: getBackgroundColor(),
          borderRadius: '24px',
          cursor: 'pointer',
          transition: 'background-color 0.1s ease',
          color: (gameState === 'idle' && !isDarkTheme) ? 'var(--text-primary)' : '#fff',
          border: gameState === 'idle' ? '3px dashed var(--border-color)' : '3px solid transparent'
        }}
      >
        <h2 className="fw-bold px-4" style={{ userSelect: 'none' }}>{getMessage()}</h2>
      </div>
      
      {reactionTime && (
        <div className="mt-4 text-center fade-in">
          <p className="text-muted mb-1">Resultado anterior:</p>
          <h3 className="text-primary fw-bold">{reactionTime} milissegundos</h3>
        </div>
      )}
    </div>
  );
};

export default TesteReflexo;
