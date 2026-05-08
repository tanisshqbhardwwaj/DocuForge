import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
const API_BASE = import.meta.env.VITE_API_URL || "";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("docuforge_token"));
  const [loading, setLoading] = useState(true);

  // On mount, verify token and fetch user
  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        // Token invalid
        logout();
      }
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");

    localStorage.setItem("docuforge_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const signup = async (company_name, email, phone, password) => {
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_name, email, phone, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Signup failed");

    localStorage.setItem("docuforge_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const saveOrganization = async (orgData) => {
    const res = await fetch(`${API_BASE}/api/auth/organization`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orgData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to save organization");
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("docuforge_token");
    setToken(null);
    setUser(null);
  };

  // Helper for authenticated API calls
  const authFetch = (url, options = {}) => {
    return fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        saveOrganization,
        authFetch,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
