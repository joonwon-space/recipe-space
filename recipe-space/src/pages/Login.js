// src/pages/Login.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import app from '../firebaseConfig';

const Login = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/'); // 로그인된 사용자는 홈 페이지로 리디렉션
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log('User signed in:', result.user);
        navigate('/'); // 로그인 성공 시 홈 페이지로 리디렉션
      })
      .catch((error) => {
        console.error('Error signing in:', error);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-4 bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <button onClick={handleGoogleSignIn} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
