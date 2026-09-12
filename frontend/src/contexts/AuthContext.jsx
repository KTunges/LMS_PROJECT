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
    // Register only creates unverified account, doesn't login yet
    await authService.register(userData);
  };

  const verifyOtp = async (email, otp) => {
    // Only verifies OTP, doesn't log in
    await authService.verifyOtp({ email, otp });
    return true;
  };

  const completeRegistration = async (email, fullName, password) => {
    const response = await authService.completeRegistration({ email, full_name: fullName, password });
    const { token, user: userData, require_pin_setup } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('requirePinSetup', require_pin_setup ? 'true' : 'false');

    setUser(userData);
    setRequirePinSetup(require_pin_setup);

    return { require_pin_setup, user: userData };
  };

  const googleLogin = async (googleToken) => {
    const response = await authService.googleLogin(googleToken);
    const { token, user: userData, require_pin_setup } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('requirePinSetup', require_pin_setup ? 'true' : 'false');

    setUser(userData);
    setRequirePinSetup(require_pin_setup);

    return { require_pin_setup, user: userData };
  };

  const facebookLogin = async (accessToken) => {
    const response = await authService.facebookLogin(accessToken);
    const { token, user: userData, require_pin_setup } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('requirePinSetup', require_pin_setup ? 'true' : 'false');

    setUser(userData);
    setRequirePinSetup(require_pin_setup);

    return { require_pin_setup, user: userData };
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
    verifyOtp,
    completeRegistration,
    googleLogin,
    facebookLogin,
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
