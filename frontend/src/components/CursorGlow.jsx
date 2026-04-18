import React, { useEffect, useRef, useState } from 'react';

const CursorGlow = () => {
  const cursorRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsMobile(true);
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let isVisible = false;
    let rafId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        cursor.style.opacity = '1';
        isVisible = true;
      }
    };

    const onMouseLeave = (e) => {
      if (e.relatedTarget === null) {
        cursor.style.opacity = '0';
        isVisible = false;
      }
    };

    const onMouseEnter = () => {
      cursor.style.opacity = '1';
      isVisible = true;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseout', onMouseLeave, { passive: true });
    window.addEventListener('mouseover', onMouseEnter, { passive: true });

    const updateCursor = () => {
      // Lerp (Linear Interpolation) for smooth trailing effect
      cursorX += (mouseX - cursorX) * 0.12;
      cursorY += (mouseY - cursorY) * 0.12;

      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;

      rafId = requestAnimationFrame(updateCursor);
    };

    rafId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseout', onMouseLeave);
      window.removeEventListener('mouseover', onMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (isMobile) return null;

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: '-150px',
        left: '-150px',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9999, // High z-index to stay above everything
        background: 'radial-gradient(circle, rgba(13, 110, 253, 0.12) 0%, rgba(13, 110, 253, 0) 70%)',
        opacity: 0,
        transition: 'opacity 0.4s ease',
        willChange: 'transform',
      }}
    />
  );
};

export default CursorGlow;
