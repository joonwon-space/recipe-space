import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import app from '../firebaseConfig';
import { Link } from 'react-router-dom';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchRecipes = async () => {
      const querySnapshot = await getDocs(collection(db, 'recipes'));
      const recipesList = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();
        const userDocRef = doc(db, 'users', data.authorId);
        const userDoc = await getDoc(userDocRef);
        const authorNickname = userDoc.exists() ? userDoc.data().nickname : 'Unknown';
        return { id: docSnapshot.id, ...data, authorNickname };
      }));
      const sortedRecipesList = recipesList.sort((a, b) => a.title.localeCompare(b.title)); // 제목을 기준으로 정렬
      setRecipes(sortedRecipesList);
      setLoading(false);
    };

    fetchRecipes();
  }, [db]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold mb-4">Home</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        recipes.map((recipe) => (
          <Link
            to={`/recipe/${recipe.id}`}
            key={recipe.id}
            className="block mb-4 p-4 bg-white shadow-md rounded hover:bg-gray-200 transition"
          >
            <h3 className="text-xl font-semibold">{recipe.title}</h3>
            <p className="text-gray-500">{`By ${recipe.authorNickname}`}</p>
            <p className="text-gray-400">{new Date(recipe.createdAt).toLocaleString()}</p>
          </Link>
        ))
      )}
    </div>
  );
};

export default Home;
