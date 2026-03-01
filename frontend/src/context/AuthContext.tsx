import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getUserMe, type UserProfile } from "../api/auth.api";
import { ACCESS_TOKEN_KEY, setAxiosAccessToken } from "../api/axios";

type UserRole = "user" | "dealer" | "admin";
type AuthUser = UserProfile & { role?: UserRole };

type AuthContextValue = {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  loginWithToken: (token: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

const extractUserProfile = (payload: unknown): AuthUser | null => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as {
    user?: AuthUser;
    firstName?: string;
    lastName?: string;
    name?: string;
    mobileNumber?: string;
    phoneNumber?: string;
    role?: UserRole;
  };

  if (candidate.user && typeof candidate.user === "object") {
    return candidate.user;
  }

  if (
    candidate.firstName ||
    candidate.lastName ||
    candidate.name ||
    candidate.mobileNumber ||
    candidate.phoneNumber ||
    candidate.role
  ) {
    return {
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      name: candidate.name,
      mobileNumber: candidate.mobileNumber,
      phoneNumber: candidate.phoneNumber,
      role: candidate.role,
    };
  }

  return null;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    setAxiosAccessToken(null);
    setAccessToken(null);
    setUser(null);
  }, []);

  const loginWithToken = useCallback(
    async (token: string) => {
      try {
        const meResponse = await getUserMe(token);
        if (!meResponse.success) {
          logout();
          return false;
        }

        const resolvedUser =
          extractUserProfile(meResponse.user) ?? extractUserProfile(meResponse.data);

        localStorage.setItem(ACCESS_TOKEN_KEY, token);
        setAxiosAccessToken(token);
        setAccessToken(token);
        setUser(resolvedUser ?? null);
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
    user,
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
