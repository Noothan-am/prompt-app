import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiUser,
  FiHeart,
  FiBookmark,
  FiEye,
  FiEyeOff,
  FiThumbsUp,
  FiThumbsDown,
  FiMessageSquare,
  FiEdit2,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

// Define TypeScript interfaces
interface UserData {
  username: string;
  displayName: string;
  bio: string;
  location: string;
  photoURL?: string;
  joinDate: string;
  coverColor: string;
  stats: {
    followers: number;
    following: number;
    totalPosts: number;
  };
  badges: Array<{
    name: string;
    color: string;
  }>;
}

interface PostItem {
  id: number;
  type: "post";
  title: string;
  upvotes: number;
  comments: number;
  timestamp: string;
  community: string;
}

interface CommentItem {
  id: number;
  type: "comment";
  content: string;
  parentPost: string;
  upvotes: number;
  timestamp: string;
  community: string;
}

type ActivityItem = PostItem | CommentItem;

interface ActivityData {
  overview: ActivityItem[];
  comments: CommentItem[];
  saved: ActivityItem[];
  hidden: ActivityItem[];
  upvoted: ActivityItem[];
  downvoted: ActivityItem[];
}

// Tab interface type
type TabType =
  | "overview"
  | "comments"
  | "saved"
  | "hidden"
  | "upvoted"
  | "downvoted";

// Mock data for activities - will be replaced with real data later
const mockActivityData: ActivityData = {
  overview: [],
  comments: [],
  saved: [],
  hidden: [],
  upvoted: [],
  downvoted: [],
};

const UserProfile = () => {
  const { username } = useParams();
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activityData, setActivityData] =
    useState<ActivityData>(mockActivityData);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        let userDoc;

        if (username) {
          // Fetch the user by username
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("username", "==", username));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            setError("User not found");
            setLoading(false);
            return;
          }

          userDoc = querySnapshot.docs[0];
        } else if (currentUser) {
          // Fetch the current user's profile
          userDoc = await getDoc(doc(db, "users", currentUser.uid));

          if (!userDoc.exists()) {
            setError("User profile not found");
            setLoading(false);
            return;
          }
        } else {
          setError("No user specified");
          setLoading(false);
          return;
        }

        const userData = userDoc.data();

        // Format the data for display
        setUserData({
          username: userData.username || "user",
          displayName: userData.displayName || userData.name || "User",
          bio: userData.bio || "No bio available",
          location: userData.location || "Unknown location",
          photoURL: userData.photoURL,
          joinDate: new Date(userData.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
          coverColor:
            "bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400",
          stats: {
            followers: 0, // Replace with actual data when available
            following: 0, // Replace with actual data when available
            totalPosts: 0, // Replace with actual data when available
          },
          badges: [], // Replace with actual data when available
        });

        // For now, using mock data. In a real app, fetch this from the database
        setActivityData(mockActivityData);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username, currentUser]);

  // Function to render content based on active tab
  const renderContent = () => {
    if (!userData) return null;

    const items = activityData[activeTab];

    if (!items || items.length === 0) {
      return (
        <div className="p-8 text-center text-gray-500">
          No content to display in this section.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {items.map((item: ActivityItem) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
          >
            {item.type === "post" ? (
              <>
                <div className="text-xs text-gray-500 mb-1">
                  r/{item.community} • Posted by u/{userData.username} •{" "}
                  {item.timestamp}
                </div>
                <h3 className="font-medium text-lg mb-2">{item.title}</h3>
                <div className="flex items-center text-sm text-gray-600 space-x-4">
                  <span className="flex items-center">
                    <FiThumbsUp className="mr-1" /> {item.upvotes}
                  </span>
                  <span className="flex items-center">
                    <FiMessageSquare className="mr-1" /> {item.comments}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="text-xs text-gray-500 mb-1">
                  Comment on{" "}
                  <span className="font-medium">{item.parentPost}</span> in r/
                  {item.community} • {item.timestamp}
                </div>
                <p className="text-gray-800 mb-2">{item.content}</p>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="flex items-center">
                    <FiThumbsUp className="mr-1" /> {item.upvotes}
                  </span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">{error}</h2>
            <Link to="/" className="mt-4 text-blue-600 hover:underline">
              Return to home
            </Link>
          </div>
        </div>
      ) : userData ? (
        <>
          {/* Cover photo + gradient */}
          <div className={`h-48 w-full ${userData.coverColor}`}></div>

          {/* Profile header section */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row">
                  {/* Avatar */}
                  <div className="flex-shrink-0 mb-4 sm:mb-0">
                    <div className="h-32 w-32 ring-4 ring-white rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl">
                      {userData.photoURL ? (
                        <img
                          src={userData.photoURL}
                          alt={`${userData.displayName}'s profile`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FiUser />
                      )}
                    </div>
                  </div>

                  {/* User info */}
                  <div className="sm:ml-6 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          {userData.displayName}
                        </h1>
                        <p className="text-gray-500">
                          u/{userData.username} • Joined {userData.joinDate}
                        </p>
                        <p className="mt-1">{userData.location}</p>
                      </div>

                      <div className="mt-4 sm:mt-0">
                        {currentUser &&
                        currentUser.username === userData.username ? (
                          <Link to="/edit-profile">
                            <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition mr-2">
                              <FiEdit2 className="mr-2" /> Edit Profile
                            </button>
                          </Link>
                        ) : (
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition mt-2 sm:mt-0">
                            Follow
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="mt-4">
                      <p className="text-gray-700">{userData.bio}</p>
                    </div>

                    {/* Stats */}
                    <div className="mt-6 flex flex-wrap gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {userData.stats.totalPosts.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">Posts</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {userData.stats.followers.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {userData.stats.following.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">Following</div>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {userData.badges.map((badge, index) => (
                        <span
                          key={index}
                          className={`${badge.color} text-white text-xs px-2 py-1 rounded-full`}
                        >
                          {badge.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-t border-gray-200">
                <nav className="flex overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`px-4 py-3 font-medium text-sm flex items-center whitespace-nowrap border-b-2 ${
                      activeTab === "overview"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <FiUser className="mr-2" /> Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("comments")}
                    className={`px-4 py-3 font-medium text-sm flex items-center whitespace-nowrap border-b-2 ${
                      activeTab === "comments"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <FiMessageSquare className="mr-2" /> Comments
                  </button>
                  <button
                    onClick={() => setActiveTab("saved")}
                    className={`px-4 py-3 font-medium text-sm flex items-center whitespace-nowrap border-b-2 ${
                      activeTab === "saved"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <FiBookmark className="mr-2" /> Saved
                  </button>
                  <button
                    onClick={() => setActiveTab("hidden")}
                    className={`px-4 py-3 font-medium text-sm flex items-center whitespace-nowrap border-b-2 ${
                      activeTab === "hidden"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <FiEyeOff className="mr-2" /> Hidden
                  </button>
                  <button
                    onClick={() => setActiveTab("upvoted")}
                    className={`px-4 py-3 font-medium text-sm flex items-center whitespace-nowrap border-b-2 ${
                      activeTab === "upvoted"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <FiThumbsUp className="mr-2" /> Upvoted
                  </button>
                  <button
                    onClick={() => setActiveTab("downvoted")}
                    className={`px-4 py-3 font-medium text-sm flex items-center whitespace-nowrap border-b-2 ${
                      activeTab === "downvoted"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <FiThumbsDown className="mr-2" /> Downvoted
                  </button>
                </nav>
              </div>
            </div>

            {/* Tab content */}
            <div className="mt-6 pb-12">{renderContent()}</div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default UserProfile;
