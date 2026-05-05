import React, { useEffect, useRef } from 'react';

/**
 * PageTransition wrapper - aplica animação suave de fade + slide
 * ao montar o componente (transição de rota).
 * 
 * Também inicializa o observer para elementos com classe 'animate-on-scroll'
 * que existam dentro da página, reutilizando a mesma lógica da Home.
 */
const PageTransition = ({ children }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'instant' });

    const container = containerRef.current;
    if (!container) return;

    // Trigger page entrance animation
    container.classList.add('page-entering');
    requestAnimationFrame(() => {
      container.classList.remove('page-entering');
      container.classList.add('page-entered');
    });

    // Initialize scroll animations for elements inside this page
    const animateElements = container.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    animateElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="page-transition-container">
      {children}
    </div>
  );
};

export default PageTransition;
