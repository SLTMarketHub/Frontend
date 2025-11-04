import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect
} from 'react';
import { useToast } from './ToastContext';
import { GoogleOAuthProvider, googleLogout } from '@react-oauth/google';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const setAuthUser = useCallback((userData) => {
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      if (userData.token) localStorage.setItem('token', userData.token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    setUser(userData);
  }, []);

  useEffect(() => {
    const loadUserFromStorage = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    loadUserFromStorage();
    const handleStorageChange = (e) => {
      if (e.key === 'user') loadUserFromStorage();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = useCallback(async (email, password) => {
    const loadingToast = toast({
      title: 'Signing in...',
      description: 'Please wait while we sign you in',
      type: 'info',
      duration: 0
    });
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Login failed');

      const mappedRole = (data?.user?.role || 'customer').toString().toLowerCase();

      const newUser = {
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        role: mappedRole,
        authProvider: 'email',
        token: data.token
      };

      setAuthUser(newUser);

      toast({
        title: 'Welcome back!',
        description: `Successfully logged in as ${newUser.email}`,
        type: 'success',
        duration: 3000
      });

      return newUser;
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error?.message || 'Invalid email or password.',
        type: 'error',
        duration: 4000
      });
      throw error;
    } finally {
      loadingToast.dismiss();
    }
  }, [toast, setAuthUser]);

  const loginWithGoogle = useCallback(async (credential) => {
    setIsGoogleLoading(true);
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${credential}` },
      });
      const googleUser = await res.json();

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: googleUser.name,
          email: googleUser.email,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      const mappedRole = (data?.user?.role || 'customer').toString().toLowerCase();

      const newUser = {
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        role: mappedRole,
        avatar: googleUser.picture,
        authProvider: 'google',
        token: data.token
      };

      setAuthUser(newUser);

      toast({
        title: 'Welcome!',
        description: `Signed in as ${newUser.name}`,
        type: 'success',
      });

      return newUser;
    } catch (err) {
      toast({
        title: 'Google login failed',
        description: err.message,
        type: 'error',
      });
      throw err;
    } finally {
      setIsGoogleLoading(false);
    }
  }, [toast, setAuthUser]);

  const logout = useCallback(() => {
    if (user?.authProvider === 'google') {
      googleLogout();
    }
    setAuthUser(null);
  }, [user, setAuthUser]);

  const updateUser = useCallback((userData) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setAuthUser(updatedUser);
      return updatedUser;
    }
    return null;
  }, [user, setAuthUser]);

  return (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
        <AuthContext.Provider
            value={{
              user,
              login,
              loginWithGoogle,
              logout,
              isAuthenticated: !!user,
              updateUser,
              isGoogleLoading,
              setAuthUser
            }}
        >
          {children}
        </AuthContext.Provider>
      </GoogleOAuthProvider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};