// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Welcome to Recipe Space</h1>
      <nav className="space-x-4">
        <Link to="/recipes" className="text-blue-500 hover:underline text-xl">View Recipes</Link>
        <Link to="/add-recipe" className="text-blue-500 hover:underline text-xl">Add Recipe</Link>
      </nav>
    </div>
  );
};

export default Home;
