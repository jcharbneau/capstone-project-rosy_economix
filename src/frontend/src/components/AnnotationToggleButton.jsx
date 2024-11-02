import React from 'react';

import { logEvent } from '../util/analytics.js';

const AnnotationToggleButton = ({ label, isActive, onClick, disabled, slideIndex }) => {
  const handleClick = () => {
    if (!disabled) {
      logEvent('Button', 'Click', `${label} clicked on slide ${slideIndex}`);
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`annotation-button ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`}

    >
      {label}
    </button>
  );
};

export default AnnotationToggleButton;
