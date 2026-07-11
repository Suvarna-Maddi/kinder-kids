import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check local storage on mount
    const storedAuth = localStorage.getItem('kinderkids_auth');
    if (storedAuth) {
      try {
        const data = JSON.parse(storedAuth);
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          setUserId(data.userId);
          setUsername(data.username || null);
        }
      } catch (e) {
        console.error("Failed to parse auth state");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (id: string, name: string) => {
    localStorage.setItem('kinderkids_auth', JSON.stringify({ isAuthenticated: true, userId: id, username: name }));
    setIsAuthenticated(true);
    setUserId(id);
    setUsername(name);
  };

  const logout = () => {
    localStorage.removeItem('kinderkids_auth');
    setIsAuthenticated(false);
    setUserId(null);
    setUsername(null);
  };

  return { isAuthenticated, userId, username, isLoading, login, logout };
}
