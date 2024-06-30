// src/pages/Recipes.js
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import app from '../firebaseConfig';
import EditRecipe from '../components/EditRecipe';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchRecipes = async () => {
      const querySnapshot = await getDocs(collection(db, 'recipes'));
      const recipesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecipes(recipesList);
    };

    fetchRecipes();
  }, [db]);

  return (
    <div>
      <h2>Recipe List</h2>
      {recipes.map((recipe) => (
        <div key={recipe.id}>
          <h3>{recipe.title}</h3>
          <p>{recipe.description}</p>
          <button onClick={() => setEditingRecipe(recipe)}>Edit</button>
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
