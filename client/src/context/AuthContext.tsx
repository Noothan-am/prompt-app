import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

interface User {
  uid: string;
  email: string | null;
  name?: string;
  username?: string;
  displayName?: string;
  bio?: string;
  location?: string;
  profileSetupComplete?: boolean;
  role?: "user" | "admin" | "community_manager";
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);

      if (firebaseUser) {
        // User is signed in
        try {
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: userData.name,
              username: userData.username,
              displayName: userData.displayName,
              bio: userData.bio,
              location: userData.location,
              profileSetupComplete: userData.profileSetupComplete,
              role: userData.role || "user",
            });
          } else {
            // Basic user data if Firestore document doesn't exist
            setCurrentUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: "user",
            });
          }
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setCurrentUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: "user",
          });
          setIsAuthenticated(true);
        }
      } else {
        // User is signed out
        setCurrentUser(null);
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign up with email and password
  const signup = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role: "user",
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error during signup:", error);
      throw error;
    }
  };

  // Sign in with email and password
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  // Check if username is available
  const checkUsernameAvailability = async (
    username: string
  ): Promise<boolean> => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      // Username is available if no documents found
      return querySnapshot.empty;
    } catch (error) {
      console.error("Error checking username availability:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    checkUsernameAvailability,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export default AuthContext;
