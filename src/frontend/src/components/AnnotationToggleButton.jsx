import React from 'react';

const AnnotationToggleButton = ({ label, isActive, onClick, disabled }) => {
  return (
    <button
      onClick={!disabled ? onClick : null}
      disabled={disabled}
      className={`annotation-button ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`}

    >
      {label}
    </button>
  );
};

export default AnnotationToggleButton;
