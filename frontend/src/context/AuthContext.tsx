import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "../types.tsx";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, tokenStr: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchMe = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`https://hired-project.onrender.com/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (e) {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    setLoading(false);
  };

  fetchMe();
}, [token]);

  const login = (userData: User, tokenStr: string) => {
    setUser(userData);
    setToken(tokenStr);
    localStorage.setItem("token", tokenStr);
     localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
