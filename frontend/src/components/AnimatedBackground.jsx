import React from 'react';
import './AnimatedBackground.css';

const AnimatedBackground = () => {
  return (
    <div className="animated-bg">
      <div className="grid-overlay"></div>
      <div className="floating-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`particle particle-${i}`}></div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedBackground;
