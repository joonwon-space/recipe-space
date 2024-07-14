import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from '../firebaseConfig';

const AddRecipe = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const db = getFirestore(app);
  const storage = getStorage(app);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = '';
      if (file) {
        console.log('Uploading file:', file.name);
        const storageRef = ref(storage, `recipes/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        console.log('File uploaded:', snapshot);
        imageUrl = await getDownloadURL(snapshot.ref);
        console.log('File available at:', imageUrl);
      }

      console.log('Adding document to Firestore');
      await addDoc(collection(db, 'recipes'), {
        title,
        description,
        imageUrl
      });

      setTitle('');
      setDescription('');
      setFile(null);
      alert('Recipe added successfully!');
    } catch (error) {
      console.error('Error adding recipe:', error);
      alert('Failed to add recipe. Please try again.');
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
        className="block mb-2 p-2 border rounded"
      />
      <textarea
        placeholder="Recipe Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="block mb-2 p-2 border rounded"
      />
      <input type="file" onChange={handleFileChange} className="block mb-2" />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">Add Recipe</button>
    </form>
  );
};

export default AddRecipe;
