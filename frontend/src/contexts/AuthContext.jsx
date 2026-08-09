import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [requirePinSetup, setRequirePinSetup] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const needsPin = localStorage.getItem('requirePinSetup') === 'true';
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setRequirePinSetup(needsPin);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('requirePinSetup');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    const { token, user: userData, require_pin_setup } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('requirePinSetup', require_pin_setup ? 'true' : 'false');
    
    setUser(userData);
    setRequirePinSetup(require_pin_setup);
    
    return { require_pin_setup, user: userData };
  };

  const completePinSetup = () => {
    setRequirePinSetup(false);
    localStorage.removeItem('requirePinSetup');
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    const { token, user: newUser } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    return { require_pin_setup: false, user: newUser };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('requirePinSetup');
    setUser(null);
    setRequirePinSetup(false);
  };

  const updateUserLocal = (newData) => {
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    login,
    register,
    completePinSetup,
    requirePinSetup,
    logout,
    updateUserLocal,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isTeacher: user?.role === 'teacher',
    isStudent: user?.role === 'student',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
