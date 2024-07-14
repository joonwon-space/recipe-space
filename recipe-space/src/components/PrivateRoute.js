// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import app from '../firebaseConfig';

const PrivateRoute = ({ children }) => {
  const auth = getAuth(app);
  const user = auth.currentUser;

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
