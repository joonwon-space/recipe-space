import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate, useParams } from 'react-router-dom';
import app from '../firebaseConfig';

const EditRecipe = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState(['']);
  const [existingImageUrls, setExistingImageUrls] = useState([]);
  const [files, setFiles] = useState([]);
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState('');
  const db = getFirestore(app);
  const storage = getStorage(app);
  const auth = getAuth(app);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = () => {
      onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setNickname(userDoc.data().nickname);
          }
        } else {
          navigate('/login');
        }
      });
    };

    fetchUser();
  }, [auth, db, navigate]);

  useEffect(() => {
    const fetchRecipe = async () => {
      const docRef = doc(db, 'recipes', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title);
        setVideoLink(data.videoLink);
        setIngredients(data.ingredients);
        setInstructions(data.instructions);
        setExistingImageUrls(data.imageUrls || []);

        if (data.authorId !== user.uid) {
          alert('You do not have permission to edit this recipe.');
          navigate('/');
        }
      } else {
        alert('Recipe not found');
        navigate('/');
      }
    };

    if (user) {
      fetchRecipe();
    }
  }, [db, id, navigate, user]);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const imageUrls = [...existingImageUrls];
      for (let file of files) {
        const storageRef = ref(storage, `recipes/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        imageUrls.push(downloadUrl);
      }

      const docRef = doc(db, 'recipes', id);
      await updateDoc(docRef, {
        title,
        videoLink,
        ingredients,
        instructions,
        authorId: user.uid,
        authorNickname: nickname,
        imageUrls
      });

      navigate('/recipes');
    } catch (error) {
      console.error('Error updating recipe:', error);
      alert('Failed to update recipe. Please try again.');
    }
  };

  const addIngredientField = () => setIngredients([...ingredients, '']);
  const addInstructionField = () => setInstructions([...instructions, '']);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold mb-4">Edit Recipe</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Video Link"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          className="block w-full p-2 mb-4 border rounded"
        />
        <h4 className="text-lg font-bold mb-2">Ingredients</h4>
        {ingredients.map((ingredient, index) => (
          <input
            key={index}
            type="text"
            placeholder="Ingredient"
            value={ingredient}
            onChange={(e) => {
              const newIngredients = [...ingredients];
              newIngredients[index] = e.target.value;
              setIngredients(newIngredients);
            }}
            className="block w-full p-2 mb-4 border rounded"
            required
          />
        ))}
        <button type="button" onClick={addIngredientField} className="mb-4 p-2 bg-green-500 text-white rounded hover:bg-green-600">
          Add Ingredient
        </button>
        <h4 className="text-lg font-bold mb-2">Instructions</h4>
        {instructions.map((instruction, index) => (
          <textarea
            key={index}
            placeholder="Instruction"
            value={instruction}
            onChange={(e) => {
              const newInstructions = [...instructions];
              newInstructions[index] = e.target.value;
              setInstructions(newInstructions);
            }}
            className="block w-full p-2 mb-4 border rounded"
            required
          />
        ))}
        <button type="button" onClick={addInstructionField} className="mb-4 p-2 bg-green-500 text-white rounded hover:bg-green-600">
          Add Instruction
        </button>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="block w-full p-2 mb-4 border rounded"
        />
        <div className="mb-4">
          {existingImageUrls.map((url, index) => (
            <img key={index} src={url} alt={`Recipe ${index}`} className="w-full h-auto mb-2 max-w-lg mx-auto" />
          ))}
        </div>
        <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Update Recipe
        </button>
      </form>
    </div>
  );
};

export default EditRecipe;
