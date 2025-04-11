import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMapPin,
  FiInfo,
  FiCheck,
  FiX,
  FiCamera,
  FiUpload,
  FiArrowRight,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebase";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const UserSetupPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    username: "",
    displayName: "",
    bio: "",
    location: "",
  });

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoURL, setPhotoURL] = useState<string>("");
  const [photoLoading, setPhotoLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [showForceRedirect, setShowForceRedirect] = useState(false);
  const [uploadFailed, setUploadFailed] = useState(false);

  // If user is not logged in, redirect to login page
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // Show force redirect option after a timeout
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (redirecting) {
      // If still redirecting after 5 seconds, show force redirect option
      timeoutId = setTimeout(() => {
        setShowForceRedirect(true);
      }, 5000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [redirecting]);

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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadFailed(false);

      // Validate file type
      if (!file.type.match("image.*")) {
        setError("Please select an image file (png, jpeg, etc.)");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      // Create local preview
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoURL(reader.result as string);
      };
      reader.readAsDataURL(file);

      setProfilePhoto(file);
      setError("");
    }
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
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

  const uploadPhoto = async (uid: string): Promise<string | null> => {
    if (!profilePhoto) return null;

    try {
      setPhotoLoading(true);

      // Create a reference to the storage location
      const storageRef = ref(storage, `profile-photos/${uid}`);

      // Upload the file
      const uploadResult = await uploadBytes(storageRef, profilePhoto);
      console.log("Upload successful:", uploadResult);

      // Get the download URL
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (err) {
      console.error("Error uploading photo:", err);
      setUploadFailed(true);
      return null;
    } finally {
      setPhotoLoading(false);
    }
  };

  const forceRedirectToHome = () => {
    // Use direct window location change as a fallback for stubborn redirects
    window.location.href = "/";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setShowForceRedirect(false);
    setUploadFailed(false);

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

      // Set redirecting early to prevent multiple submissions
      setRedirecting(true);

      // Upload photo if selected
      let photoDownloadURL = null;
      if (profilePhoto) {
        try {
          photoDownloadURL = await uploadPhoto(currentUser.uid);
          if (!photoDownloadURL) {
            throw new Error("Failed to upload photo");
          }
        } catch (photoErr) {
          console.error("Error uploading photo:", photoErr);
          setError("Failed to upload photo. Please try again.");
          setLoading(false);
          setRedirecting(false);
          return; // Stop submission if photo upload fails
        }
      }

      // Prepare user data
      const userData = {
        username: formData.username,
        displayName: formData.displayName,
        bio: formData.bio || "",
        location: formData.location || "",
        photoURL: photoDownloadURL,
        profileSetupComplete: true,
        updatedAt: new Date().toISOString(),
      };

      // Try to update existing document first
      try {
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, userData);
      } catch (updateErr) {
        // If update fails (document might not exist), try to create it
        console.error("Error updating document, trying to create:", updateErr);
        const userRef = doc(db, "users", currentUser.uid);
        await setDoc(userRef, {
          ...userData,
          email: currentUser.email,
          createdAt: new Date().toISOString(),
        });
      }

      // Set success message
      setSuccess("Profile setup complete! Redirecting to home page...");

      // Force a hard navigation to home page
      window.location.href = "/";
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
      setLoading(false);
      setRedirecting(false);
    }
  };

  // Add an emergency escape hatch
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user presses Ctrl+Home, force navigation to home page
      if (e.ctrlKey && e.key === "Home") {
        forceRedirectToHome();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
            {showForceRedirect && (
              <button
                onClick={forceRedirectToHome}
                className="ml-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs flex items-center"
              >
                Continue anyway <FiArrowRight className="ml-1" />
              </button>
            )}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center">
            <FiCheck className="mr-2 h-5 w-5" />
            <span>{success}</span>
            {redirecting && (
              <div className="ml-auto flex items-center">
                <div className="h-5 w-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                {showForceRedirect && (
                  <button
                    onClick={forceRedirectToHome}
                    className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center"
                  >
                    Go now <FiArrowRight className="ml-1" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {uploadFailed && !error && !success && (
          <div className="p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            There was a problem uploading your photo. Please try again.
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Profile Photo Upload */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div
                className="h-32 w-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer group"
                onClick={handleTriggerFileInput}
              >
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FiUser className="h-16 w-16 text-gray-400" />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiCamera className="h-8 w-8 text-white" />
                </div>
              </div>
              {photoLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-full">
                  <div className="w-8 h-8 border-2 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg, image/png, image/gif, image/webp"
              onChange={handlePhotoChange}
            />
            <button
              type="button"
              onClick={handleTriggerFileInput}
              className="mt-2 text-sm text-blue-600 flex items-center"
              disabled={redirecting || photoLoading}
            >
              <FiUpload className="mr-1" />
              {photoURL ? "Change photo" : "Upload photo"}
            </button>
            <p className="text-xs text-gray-500 mt-1">Maximum size: 5MB</p>
          </div>

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
                  disabled={redirecting}
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
                  disabled={redirecting}
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
                  disabled={redirecting}
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
                  disabled={redirecting}
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
              disabled={
                loading || !usernameAvailable || photoLoading || redirecting
              }
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading || !usernameAvailable || photoLoading || redirecting
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : redirecting ? (
                <span className="flex items-center">
                  <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Redirecting...
                </span>
              ) : (
                "Complete Setup"
              )}
            </button>
          </div>

          {photoLoading && (
            <div className="text-center text-sm text-gray-500">
              Uploading photo... This may take a moment.
            </div>
          )}

          {redirecting && showForceRedirect && (
            <div className="text-center">
              <button
                type="button"
                onClick={forceRedirectToHome}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center mx-auto"
              >
                Skip and go to home <FiArrowRight className="ml-1" />
              </button>
            </div>
          )}
        </form>

        <div className="mt-2 text-xs text-center text-gray-500">
          Press Ctrl+Home to go to home page if stuck
        </div>
      </div>
    </div>
  );
};

export default UserSetupPage;
