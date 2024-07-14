import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, deleteDoc } from 'firebase/firestore';
import app from '../firebaseConfig';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);
  const navigate = useNavigate();

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
      } else {
        alert('Recipe not found');
        navigate('/recipes');
      }
      setLoading(false);
    };

    fetchRecipe();
  }, [db, id, navigate]);

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
            <button onClick={handleDelete} className="text-red-500 hover:underline">Delete</button>
            {recipe.imageUrls && recipe.imageUrls.length > 0 && (
              <div className="mt-4">
                {recipe.imageUrls.map((url, index) => (
                  <img key={index} src={url} alt={`Recipe ${index}`} className="w-full h-auto mb-2 max-w-lg mx-auto" />
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
