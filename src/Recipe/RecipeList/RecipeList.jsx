// src/Recipe/RecipeList.jsx

import React from 'react';
import PropTypes from 'prop-types';
import RecipeCard from '../RecipeCard/RecipeCard';
import { Link } from 'react-router-dom'; // Import Link
import './RecipeList.css';

const RecipeList = ({ recipes }) => {
  if (recipes.length === 0) {
    return <p className="no-recipes">No recipes found. Try adjusting your search or filters.</p>;
  }

  return (
    <div className="recipe-list">
      {recipes.map((recipe) => (
        <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="recipe-link">
          <RecipeCard recipe={recipe} />
        </Link>
      ))}
    </div>
  );
};

RecipeList.propTypes = {
  recipes: PropTypes.arrayOf(
    PropTypes.shape({
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
    })
  ).isRequired,
};

export default RecipeList;
