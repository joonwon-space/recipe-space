// src/pages/Recipes.js
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import app from '../firebaseConfig';
import EditRecipe from '../components/EditRecipe';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const db = getFirestore(app);

  useEffect(() => {
    const fetchRecipes = async () => {
      const querySnapshot = await getDocs(collection(db, 'recipes'));
      const recipesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecipes(recipesList);
    };

    fetchRecipes();
  }, [db]);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Recipe List</h2>
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredRecipes.map((recipe) => (
        <div key={recipe.id} className="mb-4 p-4 border rounded">
          {recipe.imageUrl && (
            <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-auto mb-2" />
          )}
          <h3 className="text-xl font-semibold">{recipe.title}</h3>
          <p className="text-gray-600">{recipe.description}</p>
          <button onClick={() => setEditingRecipe(recipe)} className="text-blue-500 hover:underline">Edit</button>
        </div>
      ))}
      {editingRecipe && (
        <EditRecipe
          recipe={editingRecipe}
          onUpdate={() => {
            setEditingRecipe(null);
            // Fetch or update the list as needed
          }}
        />
      )}
    </div>
  );
};

export default Recipes;
