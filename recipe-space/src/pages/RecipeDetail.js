// src/pages/RecipeDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../firebaseConfig';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchRecipe = async () => {
      const docRef = doc(db, 'recipes', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setRecipe(docSnap.data());
      } else {
        console.error('No such document!');
      }
    };

    fetchRecipe();
  }, [db, id]);

  if (!recipe) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{recipe.title}</h2>
      <p>{recipe.description}</p>
    </div>
  );
};

export default RecipeDetail;
