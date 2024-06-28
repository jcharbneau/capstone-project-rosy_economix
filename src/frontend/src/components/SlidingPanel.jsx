import React, { useState } from 'react';
import './SlidingPanel.css';

const SlidingPanel = ({ aiFeedback, isLoading, fetchAiFeedback }) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchAiFeedback();
    }
  };

  return (
    <div className={`sliding-panel ${isOpen ? 'open' : ''}`}>
      <button className="toggle-button" onClick={togglePanel}>
        <span className="arrow">{isOpen ? '→' : '←'}</span>
        {!isOpen && <span className="tooltip">AI Insights</span>}
      </button>
      <div className="panel-content">
        {isLoading ? (
          <div className="loading-animation">Loading...</div>
        ) : (
          <div className="ai-feedback">{aiFeedback}</div>
        )}
      </div>
    </div>
  );
};

export default SlidingPanel;
