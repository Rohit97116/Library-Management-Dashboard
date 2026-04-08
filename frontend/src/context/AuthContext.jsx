import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiRequest } from "../lib/api";

const AuthContext = createContext(null);
const TOKEN_KEY = "ambey-library-token";
const USER_KEY = "ambey-library-user";

function getStoredUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(USER_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    typeof window === "undefined" ? null : window.localStorage.getItem(TOKEN_KEY)
  );
  const [user, setUser] = useState(getStoredUser);
  const [authReady, setAuthReady] = useState(false);

  const clearSession = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
    }

    setToken(null);
    setUser(null);
  }, []);

  const persistSession = useCallback((nextToken, nextUser) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(TOKEN_KEY, nextToken);
      window.localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    }

    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (credentials) => {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: credentials,
      });

      persistSession(response.token, response.user);
      return response.user;
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  useEffect(() => {
    let ignore = false;

    async function restoreSession() {
      if (!token) {
        setAuthReady(true);
        return;
      }

      try {
        const response = await apiRequest("/auth/me", { token });
        if (!ignore) {
          setUser(response.user);
          if (typeof window !== "undefined") {
            window.localStorage.setItem(USER_KEY, JSON.stringify(response.user));
          }
        }
      } catch (error) {
        if (!ignore) {
          clearSession();
        }
      } finally {
        if (!ignore) {
          setAuthReady(true);
        }
      }
    }

    restoreSession();

    return () => {
      ignore = true;
    };
  }, [clearSession, token]);

  const value = useMemo(
    () => ({
      authReady,
      isAuthenticated: Boolean(token),
      login,
      logout,
      token,
      user,
    }),
    [authReady, login, logout, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
