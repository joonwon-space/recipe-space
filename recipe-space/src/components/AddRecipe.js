// src/components/AddRecipe.js
import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import app from '../firebaseConfig';

const AddRecipe = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const db = getFirestore(app);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'recipes'), {
        title,
        description
      });
      setTitle('');
      setDescription('');
      alert('Recipe added successfully!');
    } catch (error) {
      console.error('Error adding recipe:', error);
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
      <button type="submit">Add Recipe</button>
    </form>
  );
};

export default AddRecipe;
