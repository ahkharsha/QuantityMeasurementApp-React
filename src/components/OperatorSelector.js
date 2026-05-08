import React from 'react';

const operators = ['+', '-', '*', '/'];

const OperatorSelector = ({ isVisible, selectedOperator, onOperatorSelect }) => {
  const displayClass = isVisible ? 'd-flex' : 'd-none';

  return (
    <div id="operator-selector" className={`justify-content-center gap-2 mb-4 ${displayClass}`}>
      {operators.map((op) => (
        <button
          key={op}
          className={`btn btn-outline-secondary operator-btn ${
            selectedOperator === op ? 'active' : ''
          }`}
          onClick={() => onOperatorSelect(op)}
        >
          {op === '*' ? '×' : op === '/' ? '÷' : op}
        </button>
      ))}
    </div>
  );
};

export default OperatorSelector;
