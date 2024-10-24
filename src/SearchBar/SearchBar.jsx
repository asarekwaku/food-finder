// src/SearchBar/SearchBar.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './SearchBar.css';

const SearchBar = ({ setSearchQuery }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(input.trim());
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search for recipes..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        required
      />
      <button type="submit">Search</button>
    </form>
  );
};

SearchBar.propTypes = {
  setSearchQuery: PropTypes.func.isRequired,
};

export default SearchBar;
