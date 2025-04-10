import React, { createContext, useContext, useState, useEffect } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import {
  AuthFormData,
  loginUser,
  registerUser,
  logoutUser,
} from "../services/authService";

type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  login: (data: AuthFormData) => Promise<User>;
  register: (data: AuthFormData) => Promise<User>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (data: AuthFormData): Promise<User> => {
    return loginUser(data);
  };

  const register = async (data: AuthFormData): Promise<User> => {
    return registerUser(data);
  };

  const logout = async (): Promise<void> => {
    return logoutUser();
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
