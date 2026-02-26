import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("sharespace_user");
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const signup = async (payload) => {
    const res = await api.post("/api/users/register", payload);
    return res.data;
  };

  const login = async (payload) => {
    const res = await api.post("/api/users/login", payload);
    localStorage.setItem("sharespace_user", JSON.stringify(res.data));
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("sharespace_user");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, setUser, loading, signup, login, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}