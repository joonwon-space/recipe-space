import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import AddRecipe from './pages/AddRecipe'; // AddRecipe 페이지로 이동
import EditRecipe from './pages/EditRecipe'; // EditRecipe 페이지로 이동
import Login from './pages/Login';
import Header from './components/Header';

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/add-recipe" element={<AddRecipe />} /> {/* AddRecipe 경로 추가 */}
          <Route path="/edit-recipe/:id" element={<EditRecipe />} /> {/* EditRecipe 경로 추가 */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
