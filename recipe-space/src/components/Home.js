// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Welcome to Recipe Space</h1>
      <nav className="mt-4">
        <Link to="/recipes" className="text-blue-500 underline">View Recipes</Link>
        <br />
        <Link to="/add-recipe" className="text-blue-500 underline">Add Recipe</Link>
      </nav>
    </div>
  );
};

export default Home;
