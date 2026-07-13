import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUserId(user.uid);
        
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUsername(userDoc.data().name);
          } else {
            setUsername(user.displayName || "Champion");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUsername(user.displayName || "Champion");
        }
      } else {
        setIsAuthenticated(false);
        setUserId(null);
        setUsername(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (id: string, name: string) => {
    // Kept for backward compatibility with existing UI calling login()
    // Firebase handles the actual session state automatically via onAuthStateChanged
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return { isAuthenticated, userId, username, isLoading, login, logout };
}
