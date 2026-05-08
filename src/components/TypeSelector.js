import React from 'react';

const types = [
  { id: 'Length', icon: 'bi-rulers', iconColor: '' },
  { id: 'Weight', icon: 'bi-speedometer2', iconColor: 'text-warning' },
  { id: 'Temperature', icon: 'bi-thermometer-half', iconColor: 'text-danger' },
  { id: 'Volume', icon: 'bi-cup-straw', iconColor: 'text-info' }
];

const TypeSelector = ({ selectedType, onTypeSelect }) => {
  return (
    <>
      <h5 className="text-secondary fw-bold mb-3 text-center">
        <i className="bi bi-grid-3x3-gap me-2"></i>
        CHOOSE TYPE
      </h5>
      <div className="row justify-content-center g-4 mb-5 type-container">
        {types.map((type) => (
          <div key={type.id} className="col-6 col-md-3">
            <div
              className={`card type-card text-center p-3 h-100 shadow-sm ${
                selectedType === type.id ? 'card-active' : ''
              }`}
              onClick={() => onTypeSelect(type.id)}
            >
              <div className="card-body">
                <i className={`bi ${type.icon} icon-large ${type.iconColor}`}></i>
                <h6 className="card-title fw-bold mt-2">{type.id}</h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TypeSelector;
