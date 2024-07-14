import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import app from '../firebaseConfig';

const SetNickname = () => {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();
  const auth = getAuth(app);
  const db = getFirestore(app);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          nickname: nickname
        });
        navigate('/');
      } catch (error) {
        console.error('Error setting nickname:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl mb-4">Set Your Nickname</h2>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Enter your nickname"
          className="block w-full p-2 border rounded mb-4"
          required
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Save Nickname
        </button>
      </form>
    </div>
  );
};

export default SetNickname;
