// src/Filters/Filters.jsx

import React from 'react';
import PropTypes from 'prop-types';
import './Filters.css';

const Filters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="filters">
      <select name="cuisine" value={filters.cuisine} onChange={handleChange}>
        <option value="">All Cuisines</option>
        <option value="italian">Italian</option>
        <option value="mexican">Mexican</option>
        <option value="chinese">Chinese</option>
        {/* Add more cuisines as needed */}
      </select>

      <select name="diet" value={filters.diet} onChange={handleChange}>
        <option value="">All Diets</option>
        <option value="vegetarian">Vegetarian</option>
        <option value="vegan">Vegan</option>
        <option value="keto">Keto</option>
        {/* Add more diets as needed */}
      </select>

      <input
        type="text"
        name="includeIngredients"
        placeholder="Include ingredients (comma separated)"
        value={filters.includeIngredients}
        onChange={handleChange}
      />

      <input
        type="text"
        name="excludeIngredients"
        placeholder="Exclude ingredients (comma separated)"
        value={filters.excludeIngredients}
        onChange={handleChange}
      />

      <input
        type="number"
        name="minCalories"
        placeholder="Min Calories"
        value={filters.minCalories}
        onChange={handleChange}
      />

      <input
        type="number"
        name="maxCalories"
        placeholder="Max Calories"
        value={filters.maxCalories}
        onChange={handleChange}
      />
    </div>
  );
};

Filters.propTypes = {
  filters: PropTypes.shape({
    cuisine: PropTypes.string,
    diet: PropTypes.string,
    includeIngredients: PropTypes.string,
    excludeIngredients: PropTypes.string,
    minCalories: PropTypes.string,
    maxCalories: PropTypes.string,
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
};

export default Filters;
