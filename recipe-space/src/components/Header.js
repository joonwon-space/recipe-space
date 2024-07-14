// src/components/Header.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import app from '../firebaseConfig';

const Header = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      alert('You have been logged out.');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  return (
    <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        <Link to="/">Recipe Space</Link>
      </h1>
      <nav>
        <Link to="/recipes" className="mr-4 hover:underline">Recipes</Link>
        <Link to="/add-recipe" className="mr-4 hover:underline">Add Recipe</Link>
        {user ? (
          <>
            <span className="mr-4">Welcome, {user.email}</span>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Logout</button>
          </>
        ) : (
          <Link to="/login" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
