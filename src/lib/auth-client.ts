import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        setIsAuthenticated(true);
        setUserId(user.uid);

        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUsername(userDoc.data().name);
            setGender(userDoc.data().gender || null);
          } else {
            setUsername(user.displayName || "Champion");
            setGender(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUsername(user.displayName || "Champion");
        }
      } else {
        if (user && !user.emailVerified) {
          // If they happen to be logged in but not verified, we can sign them out or just keep them unauthenticated
          // However, keeping them signed in Firebase allows them to resend verification without re-entering password.
          // We just don't grant them app access (isAuthenticated = false)
        }
        setIsAuthenticated(false);
        setUserId(null);
        setUsername(null);
        setGender(null);
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

  return { isAuthenticated, userId, username, gender, isLoading, login, logout };
}
