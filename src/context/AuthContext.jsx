import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const loggedInUser = localStorage.getItem('taskManagerUser');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // In json-server we query the users array
      const response = await api.get(`/users?email=${email}&password=${password}`);
      const foundUser = response.data[0];
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('taskManagerUser', JSON.stringify(foundUser));
        return { success: true };
      } else {
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, message: 'Server error' };
    }
  };

  const register = async (name, email, password) => {
    try {
      // Check if email already exists
      const existing = await api.get(`/users?email=${email}`);
      if (existing.data.length > 0) {
        return { success: false, message: 'Email already exists' };
      }

      const response = await api.post('/users', {
        name,
        email,
        password
      });

      const newUser = response.data;
      setUser(newUser);
      localStorage.setItem('taskManagerUser', JSON.stringify(newUser));
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Server error' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taskManagerUser');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
