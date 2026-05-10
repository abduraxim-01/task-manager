import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../services/api';

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
      // Query the custom users table in Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password);

      if (error) {
        console.error("Supabase error:", error);
        return { success: false, message: 'Database error' };
      }

      const foundUser = data && data[0];
      if (foundUser) {
        // map username to name for frontend compatibility
        const userObj = { ...foundUser, name: foundUser.username };
        setUser(userObj);
        localStorage.setItem('taskManagerUser', JSON.stringify(userObj));
        return { success: true };
      } else {
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Server error' };
    }
  };

  const register = async (name, email, password) => {
    try {
      // Check if email already exists
      const { data: existing, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email);

      if (checkError) {
        return { success: false, message: 'Database error' };
      }

      if (existing && existing.length > 0) {
        return { success: false, message: 'Email already exists' };
      }

      // Insert new user
      const { data, error } = await supabase
        .from('users')
        .insert([
          { username: name, email, password }
        ])
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        return { success: false, message: 'Failed to create user' };
      }

      const newUser = data && data[0];
      if (newUser) {
        // map username to name for frontend compatibility
        const userObj = { ...newUser, name: newUser.username };
        setUser(userObj);
        localStorage.setItem('taskManagerUser', JSON.stringify(userObj));
        return { success: true };
      }
      return { success: false, message: 'Failed to create user' };
    } catch (error) {
      console.error(error);
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
