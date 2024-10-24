// src/Recipe/RecipeCard.jsx

import React from 'react';
import PropTypes from 'prop-types';
import './RecipeCard.css';

const RecipeCard = ({ recipe }) => {
  // Extract calories from nutrition data
  const calories = recipe.nutrition?.nutrients?.find((n) => n.name === 'Calories')?.amount || 'N/A';

  return (
    <div className="recipe-card">
      <img src={recipe.image} alt={recipe.title} className="recipe-image" />
      <div className="recipe-info">
        <h3>{recipe.title}</h3>
        <p>Calories: {calories}</p>
      </div>
    </div>
  );
};

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string,
    nutrition: PropTypes.shape({
      nutrients: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          amount: PropTypes.number.isRequired,
        })
      ),
    }),
    cuisine: PropTypes.string,
  }).isRequired,
};

export default RecipeCard;
