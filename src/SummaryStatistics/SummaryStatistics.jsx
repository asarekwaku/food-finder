// src/SummaryStatistics/SummaryStatistics.jsx

import React from 'react';
import PropTypes from 'prop-types';
import './SummaryStatistics.css';

const SummaryStatistics = ({ stats }) => {
  const { total, avgCalories, cuisineDistribution } = stats;

  // Convert cuisineDistribution object to an array for rendering
  const cuisines = Object.entries(cuisineDistribution);

  return (
    <div className="summary-statistics">
      <div className="stat">
        <h3>Total Recipes Found</h3>
        <p>{total}</p>
      </div>
      <div className="stat">
        <h3>Average Calories</h3>
        <p>{avgCalories}</p>
      </div>
      <div className="stat">
        <h3>Cuisine Distribution</h3>
        <ul>
          {cuisines.map(([cuisine, count]) => (
            <li key={cuisine}>
              {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}: {count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

SummaryStatistics.propTypes = {
  stats: PropTypes.shape({
    total: PropTypes.number.isRequired,
    avgCalories: PropTypes.string.isRequired,
    cuisineDistribution: PropTypes.object.isRequired,
  }).isRequired,
};

export default SummaryStatistics;
