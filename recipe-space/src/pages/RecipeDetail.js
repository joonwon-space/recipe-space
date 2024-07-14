import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from '../firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
        }
      });
    };

    fetchUser();
  }, [auth]);

  useEffect(() => {
    const fetchRecipe = async () => {
      const docRef = doc(db, 'recipes', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const userDocRef = doc(db, 'users', data.authorId);
        const userDoc = await getDoc(userDocRef);
        const authorNickname = userDoc.exists() ? userDoc.data().nickname : 'Unknown';
        setRecipe({ id: docSnap.id, ...data, authorNickname });
        if (data.favorites && data.favorites.includes(user.uid)) {
          setIsFavorite(true);
        }
      } else {
        alert('Recipe not found');
        navigate('/recipes');
      }
      setLoading(false);
    };

    if (user) {
      fetchRecipe();
    }
  }, [db, id, navigate, user]);

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'recipes', id));
      alert('Recipe deleted successfully!');
      navigate('/recipes');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete recipe. Please try again.');
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      alert('You need to be logged in to favorite a recipe.');
      return;
    }

    const docRef = doc(db, 'recipes', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      let updatedFavorites;
      if (data.favorites && data.favorites.includes(user.uid)) {
        updatedFavorites = data.favorites.filter(uid => uid !== user.uid);
        setIsFavorite(false);
      } else {
        updatedFavorites = data.favorites ? [...data.favorites, user.uid] : [user.uid];
        setIsFavorite(true);
      }
      await updateDoc(docRef, { favorites: updatedFavorites });
    }
  };

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
      {loading ? (
        <p>Loading...</p>
      ) : (
        recipe && (
          <div className="mb-4 p-4 bg-white shadow-md rounded">
            <div className="flex items-center mb-2">
              <h3 className="text-2xl font-semibold">{recipe.title}</h3>
              {user && (
                <button onClick={toggleFavorite} className="focus:outline-none ml-2">
                  <FontAwesomeIcon
                    icon={isFavorite ? solidStar : regularStar}
                    className={`text-yellow-500 ${isFavorite ? 'fas' : 'far'}`}
                    size="lg"
                  />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between text-gray-400 mb-4">
              <p>
                By {recipe.authorNickname} on {new Date(recipe.createdAt).toLocaleString()}
              </p>
              {user && user.uid === recipe.authorId && (
                <div className="flex space-x-2">
                  <Link to={`/edit-recipe/${recipe.id}`} className="text-blue-500 hover:underline">
                    Edit
                  </Link>
                  <button onClick={handleDelete} className="text-red-500 hover:underline">
                    Delete
                  </button>
                </div>
              )}
            </div>
            <h4 className="text-lg font-bold mb-2">Ingredients</h4>
            <ul className="list-disc pl-5 text-gray-600 mb-4">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <h4 className="text-lg font-bold mb-2">Instructions</h4>
            <ol className="list-decimal pl-5 text-gray-600 mb-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
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
            {recipe.imageUrls && recipe.imageUrls.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {recipe.imageUrls.map((url, index) => (
                  <div key={index} className="w-full max-w-[512px] h-[512px] mx-auto">
                    <img src={url} alt={`Recipe ${index}`} className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default RecipeDetail;
