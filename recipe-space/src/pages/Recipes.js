import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, deleteDoc, query, where, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import app from '../firebaseConfig';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = () => {
      onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
        } else {
          setUser(null);
          navigate('/login'); // 로그인이 안되어있다면 로그인 페이지로 이동
        }
      });
    };

    fetchUser();
  }, [auth, navigate]);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const q = query(collection(db, 'recipes'), where('authorId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const recipesList = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();
        const userDocRef = doc(db, 'users', data.authorId);
        const userDoc = await getDoc(userDocRef);
        const authorNickname = userDoc.exists() ? userDoc.data().nickname : 'Unknown';
        return { id: docSnapshot.id, ...data, authorNickname };
      }));
      setRecipes(recipesList);
      setLoading(false);
    };

    fetchRecipes();
  }, [db, user]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'recipes', id));
      setRecipes(recipes.filter(recipe => recipe.id !== id));
      alert('Recipe deleted successfully!');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete recipe. Please try again.');
    }
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      let videoId = '';
      if (urlObj.hostname === 'youtu.be') {
        videoId = urlObj.pathname.substring(1);
      } else if (urlObj.hostname.includes('youtube.com')) {
        videoId = urlObj.searchParams.get('v');
      }
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      } else {
        throw new Error('Invalid YouTube URL');
      }
    } catch (error) {
      console.error('Invalid YouTube URL:', error);
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold mb-4">My Recipes</h2>
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="block w-full p-2 mb-4 border rounded"
      />
      <Link to="/add-recipe" className="mb-4 p-2 bg-green-500 text-white rounded hover:bg-green-600">
        Add New Recipe
      </Link>
      {loading ? (
        <p>Loading...</p>
      ) : (
        filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="mb-4 p-4 bg-white shadow-md rounded">
            <h3 className="text-xl font-semibold">{recipe.title}</h3>
            {recipe.videoLink && (
              <div className="mb-4 aspect-w-16 aspect-h-9">
                <iframe
                  width="100%"
                  height="100%"
                  src={getYouTubeEmbedUrl(recipe.videoLink)}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={recipe.title}
                ></iframe>
              </div>
            )}
            <h4 className="text-lg font-bold">Ingredients</h4>
            <ul className="list-disc pl-5 text-gray-600">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <h4 className="text-lg font-bold">Instructions</h4>
            <ol className="list-decimal pl-5 text-gray-600">
              {recipe.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
            <p className="text-gray-400 text-sm">By {recipe.authorNickname} on {new Date(recipe.createdAt).toLocaleDateString()}</p>
            <Link to={`/edit-recipe/${recipe.id}`} className="text-blue-500 hover:underline mr-4">Edit</Link>
            <button onClick={() => handleDelete(recipe.id)} className="text-red-500 hover:underline">Delete</button>
            {recipe.imageUrls && recipe.imageUrls.length > 0 && (
              <div className="mt-4">
                {recipe.imageUrls.map((url, index) => (
                  <img key={index} src={url} alt={`Recipe ${index}`} className="w-full h-auto mb-2 max-w-lg mx-auto" />
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Recipes;
