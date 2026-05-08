import React from 'react';

const ConversionForm = ({
  units,
  action,
  fromVal,
  onFromValChange,
  fromUnit,
  onFromUnitChange,
  toVal,
  onToValChange,
  toUnit,
  onToUnitChange,
  leftLabel,
  rightLabel,
}) => {
  const isConversion = action === 'Conversion';

  return (
    <div className="row justify-content-center g-4">
      <div className="col-md-5">
        <label className="form-label fw-bold text-dark">{leftLabel}</label>
        <div className="input-group input-group-lg mb-3 shadow-sm">
          <input
            type="number"
            className="form-control"
            placeholder="0"
            value={fromVal === null ? '' : fromVal}
            onChange={(e) => onFromValChange(e.target.value)}
          />
        </div>
        <select
          className="form-select form-select-lg shadow-sm"
          value={fromUnit}
          onChange={(e) => onFromUnitChange(e.target.value)}
        >
          <option value="" disabled>-- Select Unit --</option>
          {units.map((u) => (
            <option key={u.symbol} value={u.symbol}>
              {u.label} ({u.symbol})
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-2 d-flex align-items-center justify-content-center">
        <i className="bi bi-arrow-left-right fs-2 text-secondary d-none d-md-block"></i>
      </div>

      <div className="col-md-5">
        <label className="form-label fw-bold text-dark">{rightLabel}</label>
        <div className="input-group input-group-lg mb-3 shadow-sm">
          <input
            type="number"
            className={`form-control ${isConversion ? 'bg-light' : ''}`}
            placeholder="0"
            readOnly={isConversion}
            value={toVal === null ? '' : toVal}
            onChange={(e) => onToValChange(e.target.value)}
          />
        </div>
        <select
          className="form-select form-select-lg shadow-sm"
          value={toUnit}
          onChange={(e) => onToUnitChange(e.target.value)}
        >
          <option value="" disabled>-- Select Unit --</option>
          {units.map((u) => (
            <option key={u.symbol} value={u.symbol}>
              {u.label} ({u.symbol})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ConversionForm;
