import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
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
  const [imageUrls, setImageUrls] = useState([]);
  const [author, setAuthor] = useState('');
  const db = getFirestore(app);
  const storage = getStorage(app);
  const auth = getAuth(app);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthor(user.email);
      } else {
        setAuthor('');
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setImageUrls(selectedFiles.map(file => URL.createObjectURL(file)));
  };

  const handleIngredientsChange = (index, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = value;
    setIngredients(updatedIngredients);
  };

  const handleInstructionsChange = (index, value) => {
    const updatedInstructions = [...instructions];
    updatedInstructions[index] = value;
    setInstructions(updatedInstructions);
  };

  const addIngredientField = () => {
    setIngredients([...ingredients, '']);
  };

  const addInstructionField = () => {
    setInstructions([...instructions, '']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let uploadedImageUrls = [];
      if (files.length > 0) {
        for (let file of files) {
          const storageRef = ref(storage, `recipes/${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          const downloadUrl = await getDownloadURL(snapshot.ref);
          uploadedImageUrls.push(downloadUrl);
        }
      }

      const recipeData = {
        title,
        videoLink,
        ingredients,
        instructions,
        imageUrls: uploadedImageUrls,
        author,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'recipes'), recipeData);
      setTitle('');
      setVideoLink('');
      setIngredients(['']);
      setInstructions(['']);
      setFiles([]);
      setImageUrls([]);
      alert('Recipe added successfully!');
      navigate('/recipes');
    } catch (error) {
      console.error('Error adding recipe:', error);
      alert('Failed to add recipe. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Add a New Recipe</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Recipe Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="block w-full p-2 mb-2 border rounded"
        />
        <input
          type="text"
          placeholder="Video Link"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          className="block w-full p-2 mb-2 border rounded"
        />
        <h3 className="text-xl font-bold mb-2">Ingredients</h3>
        {ingredients.map((ingredient, index) => (
          <input
            key={index}
            type="text"
            placeholder="Ingredient"
            value={ingredient}
            onChange={(e) => handleIngredientsChange(index, e.target.value)}
            required
            className="block w-full p-2 mb-2 border rounded"
          />
        ))}
        <button type="button" onClick={addIngredientField} className="mb-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add Ingredient
        </button>
        <h3 className="text-xl font-bold mb-2">Instructions</h3>
        {instructions.map((instruction, index) => (
          <textarea
            key={index}
            placeholder="Instruction"
            value={instruction}
            onChange={(e) => handleInstructionsChange(index, e.target.value)}
            required
            className="block w-full p-2 mb-2 border rounded"
          />
        ))}
        <button type="button" onClick={addInstructionField} className="mb-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add Instruction
        </button>
        {imageUrls.length > 0 && (
          <div className="mb-2">
            {imageUrls.map((url, index) => (
              <img key={index} src={url} alt={`Recipe ${index}`} className="w-full h-auto mb-2" />
            ))}
          </div>
        )}
        <input type="file" multiple onChange={handleFileChange} className="block w-full p-2 mb-2" />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add Recipe
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;
