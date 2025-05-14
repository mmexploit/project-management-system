"use client";

import { jwtDecode } from "jwt-decode";
import { hasCookie, deleteCookie, getCookie, setCookie } from "cookies-next";
import React, {
  createContext,
  JSX,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";

interface AuthContextValue {
  user: Record<string, any> | undefined | null;
  isAuthenticated: boolean;
  error: any;
  isUser: () => boolean | undefined;
  hasRole: (role: string | string[]) => boolean | undefined;
  setUser: React.Dispatch<React.SetStateAction<null>>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [error, setError] = useState<any>();
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const token = getCookie("token");

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  }

  useEffect(() => {
    getUser().then((user) => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    setUser(token ? jwtDecode(token as string) : null);
  }, [token]);

  useEffect(() => {
    const isSignedIn = hasCookie("token") as boolean;

    setIsAuthenticated(isSignedIn);
  }, []);

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      const userInfo: Record<string, any> = jwtDecode(token as string);
      setUser(userInfo as any);
    }
  }, []);

  const isUser = () => {
    return hasCookie("token");
  };

  const hasRole = (role: string | string[]) => {
    const token = getCookie("token");
    const user: Record<string, any> | undefined = token
      ? (jwtDecode(token as string) as Record<string, any>)
      : undefined;
    if (!user || !role || !user?.role) return false;
    if (user?.role == "SUPER_ADMIN") return true;
    if (typeof role === "string") {
      return user?.role == role;
    }
    return role?.some((r) => user?.role == r);
  };

  const authContextValue = {
    user,
    isAuthenticated,
    error,
    isUser,
    hasRole,
    setUser,
  };

  return (
    <AuthContext.Provider value={authContextValue as AuthContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
