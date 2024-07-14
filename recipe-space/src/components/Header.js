import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../firebaseConfig';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = () => {
  const [user, setUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const [nickname, setNickname] = useState('');
  const auth = getAuth(app);
  const db = getFirestore(app);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setNickname(userDoc.data().nickname);
        } else {
          navigate('/set-nickname');
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth, db, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Logged out successfully');
      setShowLogout(false);
      navigate('/'); // 로그아웃 후 홈으로 리디렉션
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  const handleProfileClick = () => {
    if (user) {
      setShowLogout(!showLogout);
    } else {
      signInWithPopup(auth, provider).catch((error) => {
        console.error('Error logging in:', error);
      });
    }
  };

  return (
    <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        Recipe Space
      </Link>
      <nav>
        <ul className="flex items-center">
          {user ? (
            <>
              <li className="mr-4">
                <Link to="/add-recipe" className="p-2 bg-green-500 text-white rounded hover:bg-green-600">
                  Add Recipe
                </Link>
              </li>
              <li className="relative">
                <AccountCircleIcon
                  style={{ fontSize: 40 }}
                  className="cursor-pointer"
                  titleAccess={nickname || user.email}
                  onClick={handleProfileClick}
                />
                {showLogout && (
                  <ul className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded">
                    <li>
                      <button onClick={handleLogout} className="block px-4 py-2 w-full text-left hover:bg-gray-200">
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            </>
          ) : (
            <li>
              <AccountCircleIcon
                style={{ fontSize: 40 }}
                className="cursor-pointer"
                onClick={handleProfileClick}
              />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
