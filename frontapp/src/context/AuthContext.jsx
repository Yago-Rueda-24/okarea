import { useState, useEffect } from 'react';
import { AuthContext } from './authContextInstance';
import { loginApi, registerApi, getMeApi, updateProfileApi } from '../api/auth';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('okarea_token'));
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('okarea_user');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  });
  // If there's no stored token, loading starts as false
  const [isLoading, setIsLoading] = useState(() => Boolean(localStorage.getItem('okarea_token')));
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const storedToken = localStorage.getItem('okarea_token');

    if (!storedToken) {
      return;
    }

    // Verify token and fetch fresh user profile from backend
    getMeApi()
      .then((freshUser) => {
        if (isMounted) {
          setUser(freshUser);
          localStorage.setItem('okarea_user', JSON.stringify(freshUser));
        }
      })
      .catch((err) => {
        // If 401 or network error, session token cleared by interceptor
        if (err.response?.status === 401 && isMounted) {
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await loginApi({ email, password });
      setToken(data.accessToken);
      setUser(data.user);
      localStorage.setItem('okarea_token', data.accessToken);
      localStorage.setItem('okarea_user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Error de conexión o credenciales incorrectas.';
      const formatted = Array.isArray(msg) ? msg.join('. ') : msg;
      setError(formatted);
      throw err;
    }
  };

  const register = async ({ nombre, email, password, confirmPassword }) => {
    setError(null);
    try {
      const data = await registerApi({ nombre, email, password, confirmPassword });
      setToken(data.accessToken);
      setUser(data.user);
      localStorage.setItem('okarea_token', data.accessToken);
      localStorage.setItem('okarea_user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Error al crear la cuenta. Por favor verifique los datos.';
      const formatted = Array.isArray(msg) ? msg.join('. ') : msg;
      setError(formatted);
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);
    localStorage.removeItem('okarea_token');
    localStorage.removeItem('okarea_user');
  };

  const updateProfile = async (updateData) => {
    try {
      const updated = await updateProfileApi(updateData);
      setUser((prev) => ({ ...prev, ...updated }));
      localStorage.setItem(
        'okarea_user',
        JSON.stringify({ ...user, ...updated }),
      );
      return updated;
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Error al actualizar el perfil.';
      const formatted = Array.isArray(msg) ? msg.join('. ') : msg;
      setError(formatted);
      throw err;
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    error,
    setError,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
