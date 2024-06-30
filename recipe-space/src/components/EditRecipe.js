import React, { useState } from 'react';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import app from '../firebaseConfig';

const EditRecipe = ({ recipe, onUpdate }) => {
  const [title, setTitle] = useState(recipe.title);
  const [description, setDescription] = useState(recipe.description);
  const db = getFirestore(app);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const recipeRef = doc(db, 'recipes', recipe.id);
      await updateDoc(recipeRef, {
        title,
        description,
      });
      onUpdate();
      alert('Recipe updated successfully!');
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Recipe Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Recipe Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <button type="submit">Update Recipe</button>
    </form>
  );
};

export default EditRecipe;
