import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMapPin, FiInfo, FiCheck, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const UserSetupPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    displayName: "",
    bio: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [usernameChecking, setUsernameChecking] = useState(false);

  // If user is not logged in, redirect to login page
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // Check username availability with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      checkUsernameAvailability(formData.username);
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username]);

  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setUsernameChecking(true);
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      // Username is available if no documents found
      setUsernameAvailable(querySnapshot.empty);
    } catch (err) {
      console.error("Error checking username:", err);
      setUsernameAvailable(null);
    } finally {
      setUsernameChecking(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate
    if (!formData.username || !formData.displayName) {
      setError("Username and display name are required");
      setLoading(false);
      return;
    }

    if (!usernameAvailable) {
      setError("Username is not available. Please choose another one.");
      setLoading(false);
      return;
    }

    try {
      if (!currentUser?.uid) {
        throw new Error("User not authenticated");
      }

      // Update user document with profile information
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        username: formData.username,
        displayName: formData.displayName,
        bio: formData.bio || "",
        location: formData.location || "",
        profileSetupComplete: true,
        updatedAt: new Date().toISOString(),
      });

      navigate("/"); // Redirect to home or profile page
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <div className="flex items-center justify-center mb-4">
            <div className="h-8 w-8 rounded bg-red-500 text-white flex items-center justify-center mr-2">
              <span className="font-bold">+</span>
            </div>
            <span className="text-gray-800 font-medium">tempo</span>
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Set up your profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Let's complete your profile so others can find and connect with you
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username *
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className={`appearance-none block w-full pl-10 pr-10 py-2 border ${
                    usernameAvailable === false
                      ? "border-red-300"
                      : usernameAvailable === true
                      ? "border-green-300"
                      : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Choose a unique username"
                  minLength={3}
                  maxLength={20}
                  pattern="^[a-zA-Z0-9_]+$"
                  title="Username can only contain letters, numbers, and underscores"
                />
                {usernameChecking ? (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="h-4 w-4 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  usernameAvailable !== null && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {usernameAvailable ? (
                        <FiCheck className="h-5 w-5 text-green-500" />
                      ) : (
                        <FiX className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  )
                )}
              </div>
              {formData.username && formData.username.length > 0 && (
                <p className="mt-1 text-xs text-gray-500">
                  {usernameAvailable === null && formData.username.length < 3
                    ? "Username must be at least 3 characters"
                    : usernameAvailable === true
                    ? "Username is available"
                    : usernameAvailable === false
                    ? "This username is already taken"
                    : "Checking username..."}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-700"
              >
                Display Name *
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your public display name"
                  maxLength={50}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="City, Country (optional)"
                  maxLength={100}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700"
              >
                Bio
              </label>
              <div className="mt-1 relative">
                <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                  <FiInfo className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us a little about yourself (optional)"
                  maxLength={250}
                />
              </div>
              <p className="mt-1 text-xs text-right text-gray-500">
                {formData.bio.length}/250 characters
              </p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !usernameAvailable}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading || !usernameAvailable
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
            >
              {loading ? "Saving..." : "Complete Setup"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserSetupPage;
