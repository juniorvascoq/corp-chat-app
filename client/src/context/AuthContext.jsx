import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import config from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchStats = async (token) => {
    try {
      const res = await axios.get(`${config.apiUrl}/users/me/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProductCount(res.data.productCount);
    } catch (err) {
      console.error('Error fetching stats', err);
    }
  };

  const incrementProductCount = () => setProductCount(prev => prev + 1);

  // Al iniciar la app, chequeamos si hay token guardado
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      fetchStats(token);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${config.apiUrl}/auth/login`, {
        username,
        password
      });

      const { token, user: loggedUser } = response.data;
      
      // Guardar sesión
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setUser(loggedUser);
      fetchStats(token);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión con el servidor'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setProductCount(0);
  };

  return (
    <AuthContext.Provider value={{ user, productCount, incrementProductCount, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
