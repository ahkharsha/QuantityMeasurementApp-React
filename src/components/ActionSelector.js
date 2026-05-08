import React from 'react';

const actions = [
  { name: 'Conversion', icon: 'bi-arrow-left-right' },
  { name: 'Comparison', icon: 'bi-arrow-down-up' },
  { name: 'Arithmetic', icon: 'bi-calculator' }
];

const ActionSelector = ({ selectedAction, onActionSelect }) => {
  return (
    <>
      <h5 className="text-secondary fw-bold mb-3 text-center">
        <i className="bi bi-lightning-charge me-2"></i>
        CHOOSE ACTION
      </h5>
      <div className="d-flex justify-content-center flex-wrap gap-3 mb-4 action-container">
        {actions.map((action) => (
          <button
            key={action.name}
            className={`btn action-btn shadow-sm ${
              selectedAction === action.name
                ? 'btn-primary active'
                : 'btn-light text-secondary border'
            }`}
            onClick={() => onActionSelect(action.name)}
          >
            <i className={`bi ${action.icon} me-2`}></i>
            {action.name}
          </button>
        ))}
      </div>
    </>
  );
};

export default ActionSelector;
