import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; 
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import AddRecipe from './pages/AddRecipe'; 
import EditRecipe from './pages/EditRecipe'; 
import SetNickname from './pages/SetNickname'; // SetNickname 페이지 import
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
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path="/edit-recipe/:id" element={<EditRecipe />} />
          <Route path="/set-nickname" element={<SetNickname />} /> {/* SetNickname 경로 추가 */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
