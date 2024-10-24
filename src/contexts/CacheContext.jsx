// src/contexts/CacheContext.jsx

import React, { createContext, useState } from 'react';

// Create a Context for caching
export const CacheContext = createContext();

// Provider component to wrap around the App
export const CacheProvider = ({ children }) => {
  // Initialize cache as an empty object
  const [cache, setCache] = useState({});

  // Function to add data to cache
  const addToCache = (key, data) => {
    setCache((prevCache) => ({
      ...prevCache,
      [key]: data,
    }));
  };

  // Function to retrieve data from cache
  const getFromCache = (key) => {
    return cache[key];
  };

  return (
    <CacheContext.Provider value={{ addToCache, getFromCache }}>
      {children}
    </CacheContext.Provider>
  );
};
