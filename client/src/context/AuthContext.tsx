import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type UserRole = "user" | "admin" | "community_manager";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loginAsCommunityManager: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Create a default user for testing purposes
  const defaultUser: User = {
    id: "123",
    name: "noothan",
    email: "noothan@gmail.in",
    role: "user",
  };

  const [user, setUser] = useState<User | null>(defaultUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Check for existing session on load
  useEffect(() => {
    // In a real app, you would check localStorage or cookies for auth token
    // and validate it with your backend
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Failed to parse saved user data");
        localStorage.removeItem("user");
        // Set the default user if the saved one fails
        setUser(defaultUser);
      }
    } else {
      // If no saved user, use the default one for easier testing
      localStorage.setItem("user", JSON.stringify(defaultUser));
    }
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    // In a real app, you would make an API call to authenticate
    // This is just a mock implementation
    const mockUser: User = {
      id: "123",
      name: email.split("@")[0], // Use first part of email as name
      email: email,
      role: "user",
    };

    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(mockUser));

    console.log("User logged in:", mockUser);
    return Promise.resolve();
  };

  // Enhanced logout to clear everything
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");

    // Add delay before logging out to improve UX
    console.log("User logged out");
  };

  // Mock function to switch to community manager role
  const loginAsCommunityManager = () => {
    // If user is already logged in, maintain their name and email
    const communityManagerUser: User = {
      id: "456",
      name: user ? user.name : "Community Manager",
      email: user ? user.email : "manager@example.com",
      role: "community_manager",
    };

    setUser(communityManagerUser);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(communityManagerUser));

    console.log("Switched to community manager:", communityManagerUser);
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    loginAsCommunityManager,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
