import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getUserMe } from "../api/auth.api";
import { ACCESS_TOKEN_KEY, setAxiosAccessToken } from "../api/axios";

type AuthContextValue = {
  accessToken: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  loginWithToken: (token: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    setAxiosAccessToken(null);
    setAccessToken(null);
  }, []);

  const loginWithToken = useCallback(
    async (token: string) => {
      try {
        const meResponse = await getUserMe(token);
        if (!meResponse.success) {
          logout();
          return false;
        }

        localStorage.setItem(ACCESS_TOKEN_KEY, token);
        setAxiosAccessToken(token);
        setAccessToken(token);
        return true;
      } catch {
        logout();
        return false;
      }
    },
    [logout]
  );

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (!token) {
      setIsBootstrapping(false);
      return;
    }

    void loginWithToken(token).finally(() => {
      setIsBootstrapping(false);
    });
  }, [loginWithToken]);

  const value: AuthContextValue = {
    accessToken,
    isAuthenticated: Boolean(accessToken),
    isBootstrapping,
    loginWithToken,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
