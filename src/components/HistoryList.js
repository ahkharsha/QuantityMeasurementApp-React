import React from 'react';

const HistoryList = ({ records }) => {
  const safeRecords = Array.isArray(records) ? records : [];

  return (
    <div className="mt-5 history-container">
      <h5 className="text-secondary fw-bold mb-3">
        <i className="bi bi-clock-history me-2"></i>
        HISTORY
      </h5>
      <div className="card shadow-sm p-3">
        <ul className="list-group list-group-flush mb-0">
          {safeRecords.length === 0 ? (
            <li className="list-group-item text-muted">
              <i className="bi bi-info-circle me-2"></i>
              No history yet.
            </li>
          ) : (
            safeRecords.map((r, idx) => (
              <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                <strong>
                  <i className="bi bi-journal-check text-success me-2"></i>
                  {r.expression} = {r.result}
                </strong>
                <span className="text-muted">
                  <i className="bi bi-calendar3 me-1"></i>
                  {new Date(r.timestamp).toLocaleString()}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default HistoryList;
