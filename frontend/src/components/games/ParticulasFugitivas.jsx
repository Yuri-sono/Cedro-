import React, { useState, useEffect, useRef } from 'react';

const ParticulasFugitivas = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const mousePos = useRef({ x: -1000, y: -1000 });

  const initGame = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;
    
    const initialParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * (width - 40) + 20,
      y: Math.random() * (height - 40) + 20,
      vx: (Math.random() - 0.5) * 2.5,
      vy: (Math.random() - 0.5) * 2.5,
      radius: Math.random() * 12 + 10,
      color: `hsl(${Math.random() * 360}, 80%, 65%)`,
      active: true
    }));
    
    particlesRef.current = initialParticles;
    setScore(0);
    setGameStarted(true);
  };

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        canvasRef.current.width = rect.width;
        canvasRef.current.height = rect.height;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleMouseLeave = () => {
      mousePos.current = { x: -1000, y: -1000 };
    };

    const handleMouseDown = (e) => {
      if (!gameStarted) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      let hit = false;
      particlesRef.current = particlesRef.current.filter(p => {
        const dx = p.x - clickX;
        const dy = p.y - clickY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= p.radius) {
          hit = true;
          return false;
        }
        return true;
      });

      if (hit) {
        setScore(prev => prev + 1);
        setTimeout(() => {
          if (!gameStarted) return;
          if (canvasRef.current) {
            const w = canvasRef.current.width;
            const h = canvasRef.current.height;
            particlesRef.current.push({
              id: Date.now() + Math.random(),
              x: Math.random() * (w - 40) + 20,
              y: Math.random() * (h - 40) + 20,
              vx: (Math.random() - 0.5) * 2.5,
              vy: (Math.random() - 0.5) * 2.5,
              radius: Math.random() * 12 + 10,
              color: `hsl(${Math.random() * 360}, 80%, 65%)`,
              active: true
            });
          }
        }, 800);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('mousedown', handleMouseDown);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('mousedown', handleMouseDown);
    };
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const updateParticles = () => {
      const width = canvas.width;
      const height = canvas.height;
      const mouse = mousePos.current;

      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < p.radius) { p.x = p.radius; p.vx *= -1; }
        if (p.x > width - p.radius) { p.x = width - p.radius; p.vx *= -1; }
        if (p.y < p.radius) { p.y = p.radius; p.vy *= -1; }
        if (p.y > height - p.radius) { p.y = height - p.radius; p.vy *= -1; }

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const fleeRadius = 120;

        if (dist < fleeRadius) {
          const force = (fleeRadius - dist) / fleeRadius;
          p.vx += (dx / dist) * force * 2.5;
          p.vy += (dy / dist) * force * 2.5;
        }

        p.vx *= 0.96;
        p.vy *= 0.96;
        
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed < 0.8) {
            p.vx += (Math.random() - 0.5) * 0.4;
            p.vy += (Math.random() - 0.5) * 0.4;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        
        // Simulating the 3D look
        const gradient = ctx.createRadialGradient(
          p.x - p.radius * 0.3, 
          p.y - p.radius * 0.3, 
          p.radius * 0.1, 
          p.x, 
          p.y, 
          p.radius
        );
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(0.2, p.color);
        gradient.addColorStop(1, p.color);
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill(); // Fill again for shadow
        ctx.shadowBlur = 0; // Reset shadow blur
      });

      animationRef.current = requestAnimationFrame(updateParticles);
    };

    animationRef.current = requestAnimationFrame(updateParticles);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameStarted]);

  return (
    <div className="d-flex flex-column align-items-center w-100">
      <h4 className="mb-3 fw-bold text-primary">Partículas Fugitivas</h4>
      <p className="text-muted text-center mb-3">Concentre-se e tente clicar nas partículas coloridas. Elas vão tentar escapar do seu mouse!</p>
      
      <div className="d-flex justify-content-between align-items-center w-100 px-3 mb-4" style={{ maxWidth: '650px' }}>
        <div className="badge bg-primary rounded-pill px-4 py-2 fs-6 shadow-sm">
          <i className="bi bi-star-fill text-warning me-2"></i>
          Pontuação: {score}
        </div>
        {!gameStarted ? (
          <button className="btn btn-success px-4 rounded-pill fw-bold shadow-sm" onClick={initGame}>
            <i className="bi bi-play-fill me-1"></i> Começar
          </button>
        ) : (
          <button className="btn btn-outline-danger btn-sm rounded-pill px-3" onClick={() => setGameStarted(false)}>
            Parar
          </button>
        )}
      </div>
      
      <div 
        ref={containerRef}
        className="position-relative overflow-hidden shadow"
        style={{
          width: '100%',
          maxWidth: '650px',
          height: '400px',
          backgroundColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#0a0a0a' : '#f8f9fa',
          borderRadius: '24px',
          border: '1px solid var(--border-color)',
          cursor: gameStarted ? 'crosshair' : 'default',
          backgroundImage: 'radial-gradient(var(--border-color) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block', zIndex: 5, position: 'relative' }}
        />
        {!gameStarted && score === 0 && (
          <div className="position-absolute top-50 start-50 translate-middle text-center text-muted" style={{ zIndex: 10, pointerEvents: 'none' }}>
            <i className="bi bi-cursor fs-1 mb-2 d-block opacity-50"></i>
            <p>Clique em "Começar" para jogar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticulasFugitivas;
