// src/App.jsx
// src/App.jsx

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Header from './Header/Header';
import SearchBar from './SearchBar/SearchBar';
import Filters from './Filters/Filters';
import SummaryStatistics from './SummaryStatistics/SummaryStatistics';
import RecipeList from './Recipe/RecipeList/RecipeList';
import Pagination from './Pagination/Pagination';
import { CacheContext } from './contexts/CacheContext';
import './App.css'; // Optional: For styling

const App = () => {
  // ------------------------------
  // State Variables
  // ------------------------------

  // Holds the array of fetched recipes
  const [recipes, setRecipes] = useState([]);

  // Stores the user's search input
  const [searchQuery, setSearchQuery] = useState('');

  // Manages all active filters
  const [filters, setFilters] = useState({
    cuisine: '',
    diet: '',
    includeIngredients: '',
    excludeIngredients: '',
    maxCalories: '',
    minCalories: '',
  });

  // Contains calculated summary statistics based on fetched recipes
  const [summaryStats, setSummaryStats] = useState({
    total: 0,
    avgCalories: 0,
    cuisineDistribution: {},
  });

  // Manages loading and error states for API calls
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const resultsPerPage = 20; // Number of recipes per page

  // ------------------------------
  // Context for Caching
  // ------------------------------

  // Access caching functions from CacheContext
  const { addToCache, getFromCache } = useContext(CacheContext);

  // ------------------------------
  // Environment Variables
  // ------------------------------

  // Access the Spoonacular API key from environment variables
  const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

  // Spoonacular API endpoint for complex search
  const API_URL = 'https://api.spoonacular.com/recipes/complexSearch';

  // ------------------------------
  // Function to Fetch Recipes
  // ------------------------------

  const fetchRecipes = async () => {
    setLoading(true); // Start loading
    setError(null); // Reset any previous errors

    try {
      // Construct API request parameters based on searchQuery and filters
      const params = {
        apiKey: API_KEY,
        query: searchQuery,
        cuisine: filters.cuisine || undefined,
        diet: filters.diet || undefined,
        includeIngredients: filters.includeIngredients || undefined,
        excludeIngredients: filters.excludeIngredients || undefined,
        maxCalories: filters.maxCalories || undefined,
        minCalories: filters.minCalories || undefined,
        number: resultsPerPage,
        offset: (currentPage - 1) * resultsPerPage,
        addRecipeNutrition: true, // To fetch nutritional information
      };

      // Remove any undefined or empty parameters to clean the request
      Object.keys(params).forEach((key) => {
        if (params[key] === undefined || params[key] === '') {
          delete params[key];
        }
      });

      // Create a unique cache key based on the parameters
      const cacheKey = JSON.stringify(params);

      // Check if the response for these parameters is already cached
      const cachedData = getFromCache(cacheKey);
      if (cachedData) {
        setRecipes(cachedData.results);
        setTotalResults(cachedData.totalResults);
        calculateSummaryStats(cachedData.results);
        setLoading(false);
        console.log('Data retrieved from cache.');
        return; // Exit the function early since we have cached data
      }

      // Make the API request using axios
      const response = await axios.get(API_URL, { params });
      console.log('API Response:', response.data); // Debugging

      // Update state with fetched recipes and total results
      setRecipes(response.data.results);
      setTotalResults(response.data.totalResults);

      // Calculate and update summary statistics
      calculateSummaryStats(response.data.results);

      // Add the fetched data to cache for future use
      addToCache(cacheKey, response.data);
      console.log('Data fetched from API and cached.');
    } catch (err) {
      console.error('Error fetching recipes:', err); // Log the error for debugging

      // Enhanced Error Handling
      if (err.response) {
        // Server responded with a status other than 2xx
        if (err.response.status === 402) { // Assuming 402 for quota exceeded
          setError('API quota exceeded. Please try again later.');
        } else {
          setError(`Error: ${err.response.data.message || 'An error occurred.'}`);
        }
      } else if (err.request) {
        // Request was made but no response received
        setError('Network error. Please check your connection.');
      } else {
        // Something else happened while setting up the request
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // ------------------------------
  // Function to Calculate Summary Statistics
  // ------------------------------

  const calculateSummaryStats = (data) => {
    const total = data.length;

    // Calculate average calories
    const totalCalories = data.reduce((acc, recipe) => {
      if (recipe.nutrition && recipe.nutrition.nutrients) {
        const calories = recipe.nutrition.nutrients.find((n) => n.name === 'Calories');
        return acc + (calories ? calories.amount : 0);
      }
      return acc;
    }, 0);
    const avgCalories = total > 0 ? (totalCalories / total).toFixed(2) : 0;

    // Calculate cuisine distribution
    const cuisineCount = data.reduce((acc, recipe) => {
      // Assuming cuisine information is available in the recipe object
      if (recipe.cuisine) {
        acc[recipe.cuisine] = (acc[recipe.cuisine] || 0) + 1;
      } else {
        acc['Unknown'] = (acc['Unknown'] || 0) + 1;
      }
      return acc;
    }, {});

    // Update the summary statistics state
    setSummaryStats({
      total,
      avgCalories,
      cuisineDistribution: cuisineCount,
    });
  };

  // ------------------------------
  // useEffect Hooks
  // ------------------------------

  // Fetch recipes whenever searchQuery, filters, or currentPage change
  useEffect(() => {
    fetchRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filters, currentPage]);

  // Reset to first page whenever searchQuery or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  // ------------------------------
  // Derived Variables
  // ------------------------------

  // Calculate total number of pages based on totalResults
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  // Get current page recipes (Assuming API handles pagination)
  const currentRecipes = recipes; // API provides paginated data based on 'offset' and 'number'

  // ------------------------------
  // Render the Component
  // ------------------------------

  return (
    <div className="App">
      {/* Header Component */}
      <Header />

      {/* SearchBar Component */}
      <SearchBar setSearchQuery={setSearchQuery} />

      {/* Filters Component */}
      <Filters filters={filters} setFilters={setFilters} />

      {/* Loading Indicator */}
      {loading && <p className="loading">Loading...</p>}

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      {/* SummaryStatistics Component */}
      <SummaryStatistics stats={summaryStats} />

      {/* RecipeList Component */}
      <RecipeList recipes={currentRecipes} />

      {/* Pagination Component */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      {/* Welcome Message */}
      <p className="welcome-message">Welcome to the Recipe Search App!</p>
    </div>
  );
};

export default App;
