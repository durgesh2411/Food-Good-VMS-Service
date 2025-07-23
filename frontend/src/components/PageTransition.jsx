import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Reset visibility when location changes
    setIsVisible(false);

    // Use requestAnimationFrame for smoother transitions
    const timer = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });

    return () => cancelAnimationFrame(timer);
  }, [location.pathname]);

  return (
    <div
      style={{
        transition: 'opacity 0.2s ease-in-out',
        opacity: isVisible ? 1 : 0,
        willChange: 'opacity'
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;
