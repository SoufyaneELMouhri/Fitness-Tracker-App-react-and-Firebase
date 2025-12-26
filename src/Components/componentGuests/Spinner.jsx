import React from 'react';
import { Spinner as BootstrapSpinner } from 'react-bootstrap';

const Spinner = () => {
  return (
    <div className="min-vh-100 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center">
      <div className="text-center">
        {/* Spinner */}
        <div className="position-relative mb-4">
          <BootstrapSpinner 
            animation="border" 
            variant="primary"
            style={{ width: '80px', height: '80px', borderWidth: '6px' }}
          />
          <div 
            className="position-absolute top-50 start-50 translate-middle"
          >
            <span style={{ fontSize: '2rem' }}>💪</span>
          </div>
        </div>

        {/* Loading Text */}
        <h4 className="text-primary fw-bold mb-3">Loading</h4>
        
        {/* Dots */}
        <div className="d-flex justify-content-center gap-2">
          <BootstrapSpinner animation="grow" variant="primary" size="sm" />
          <BootstrapSpinner animation="grow" variant="primary" size="sm" />
          <BootstrapSpinner animation="grow" variant="primary" size="sm" />
        </div>
      </div>
    </div>
  );
};

export default Spinner;
