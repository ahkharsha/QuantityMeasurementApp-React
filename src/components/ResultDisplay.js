import React, { useEffect, useState } from 'react';

const ResultDisplay = ({ value, unitSymbol }) => {
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    if (value !== null && value !== undefined && value !== '') {
      setHighlight(true);
      const timer = setTimeout(() => {
        setHighlight(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [value, unitSymbol]);

  const displayVal = (value === null || value === undefined) ? "—" : value;

  return (
    <div className={`text-center my-5 result-panel ${highlight ? 'highlight' : ''}`}>
      <h2 className="display-4 fw-bold text-success">
        <span>{displayVal}</span> <span className="fs-4">{unitSymbol}</span>
      </h2>
    </div>
  );
};

export default ResultDisplay;
