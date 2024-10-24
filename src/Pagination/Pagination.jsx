// src/Pagination/Pagination.jsx

import React from 'react';
import PropTypes from 'prop-types';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="pagination">
      <button onClick={handlePrev} disabled={currentPage === 1}>
        &laquo; Prev
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={handleNext} disabled={currentPage === totalPages}>
        Next &raquo;
      </button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
