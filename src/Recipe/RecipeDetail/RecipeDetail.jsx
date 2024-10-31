// src/Recipe/RecipeDetail/RecipeDetail.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CacheContext } from '../../contexts/CacheContext';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './RecipeDetail.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const RecipeDetail = () => {
  const { id } = useParams(); // Extract recipe ID from URL
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { addToCache, getFromCache } = useContext(CacheContext);

  // Access the Spoonacular API key from environment variables
  const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

  // Spoonacular API endpoint for getting recipe information
  const RECIPE_URL = `https://api.spoonacular.com/recipes/${id}/information`;

  const fetchRecipeDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        apiKey: API_KEY,
        includeNutrition: true,
      };

      const cacheKey = `recipe_${id}`;

      // Check cache
      const cachedData = getFromCache(cacheKey);
      if (cachedData) {
        setRecipe(cachedData);
        setLoading(false);
        console.log('Recipe detail retrieved from cache.');
        return;
      }

      // Fetch recipe detail from API
      const response = await axios.get(RECIPE_URL, { params });
      console.log('Recipe Detail API Response:', response.data);

      setRecipe(response.data);

      // Cache the data
      addToCache(cacheKey, response.data);
      console.log('Recipe detail fetched from API and cached.');
    } catch (err) {
      console.error('Error fetching recipe detail:', err);

      // Enhanced Error Handling
      if (err.response) {
        if (err.response.status === 404) {
          setError('Recipe not found.');
        } else if (err.response.status === 402) {
          setError('API quota exceeded. Please try again later.');
        } else {
          setError(`Error: ${err.response.data.message || 'An error occurred.'}`);
        }
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipeDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <p className="loading">Loading recipe details...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!recipe) return null;

  // Prepare data for the first chart (Bar Chart: Nutrients)
  const nutrientNames = ['Calories', 'Fat', 'Carbohydrates', 'Protein'];
  const nutrientValues = nutrientNames.map((name) => {
    const nutrient = recipe.nutrition.nutrients.find((n) => n.name === name);
    return nutrient ? nutrient.amount : 0;
  });

  const barChartData = {
    labels: nutrientNames,
    datasets: [
      {
        label: 'Nutrient Amount',
        data: nutrientValues,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Nutrient Breakdown',
      },
      legend: {
        display: false,
      },
    },
  };

  // Prepare data for the second chart (Pie Chart: Ingredient Categories)
  // Categorize ingredients based on certain keywords
  const categorizeIngredient = (ingredient) => {
    const name = ingredient.name.toLowerCase();
    if (name.includes('chicken') || name.includes('beef') || name.includes('pork')) return 'Proteins';
    if (name.includes('carrot') || name.includes('lettuce') || name.includes('broccoli')) return 'Vegetables';
    if (name.includes('rice') || name.includes('pasta') || name.includes('bread')) return 'Carbohydrates';
    if (name.includes('milk') || name.includes('cheese') || name.includes('cream')) return 'Dairy';
    return 'Others';
  };

  const ingredientCategories = recipe.extendedIngredients.reduce((acc, ingredient) => {
    const category = categorizeIngredient(ingredient);
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = {
    labels: Object.keys(ingredientCategories),
    datasets: [
      {
        data: Object.values(ingredientCategories),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',    // Proteins
          'rgba(54, 162, 235, 0.6)',    // Vegetables
          'rgba(255, 206, 86, 0.6)',    // Carbohydrates
          'rgba(75, 192, 192, 0.6)',    // Dairy
          'rgba(153, 102, 255, 0.6)',   // Others
        ],
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Ingredient Categories',
      },
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="recipe-detail">
      <Link to="/" className="back-link">← Back to Recipes</Link>

      <h2>{recipe.title}</h2>
      {recipe.image && <img src={recipe.image} alt={recipe.title} className="recipe-detail-image" />}

      <div className="recipe-info">
        <h3>Summary</h3>
        <div dangerouslySetInnerHTML={{ __html: recipe.summary }} />

        <h3>Ingredients</h3>
        <ul>
          {recipe.extendedIngredients.map((ingredient) => (
            <li key={ingredient.id}>{ingredient.original}</li>
          ))}
        </ul>

        <h3>Instructions</h3>
        {recipe.instructions ? (
          <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
        ) : (
          <p>No instructions available.</p>
        )}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <Bar data={barChartData} options={barChartOptions} />
        </div>
        <div className="chart-container">
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
