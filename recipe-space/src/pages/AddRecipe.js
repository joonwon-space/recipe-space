import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import app from '../firebaseConfig';

const AddRecipe = () => {
  const [title, setTitle] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState(['']);
  const [files, setFiles] = useState([]);
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState('');
  const db = getFirestore(app);
  const storage = getStorage(app);
  const auth = getAuth(app);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setNickname(userDoc.data().nickname);
        }
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const imageUrls = [];
      for (let file of files) {
        const storageRef = ref(storage, `recipes/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        imageUrls.push(downloadUrl);
      }

      await addDoc(collection(db, 'recipes'), {
        title,
        videoLink,
        ingredients,
        instructions,
        authorId: user.uid,
        authorNickname: nickname,
        createdAt: new Date().toISOString(),
        imageUrls
      });

      navigate('/recipes');
    } catch (error) {
      console.error('Error adding recipe:', error);
      alert('Failed to add recipe. Please try again.');
    }
  };

  const addIngredientField = () => setIngredients([...ingredients, '']);
  const addInstructionField = () => setInstructions([...instructions, '']);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold mb-4">Add Recipe</h2>
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
        <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add Recipe
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;
