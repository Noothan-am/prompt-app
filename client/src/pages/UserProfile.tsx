import { useState } from "react";
import {
  FiUser,
  FiHeart,
  FiBookmark,
  FiEye,
  FiEyeOff,
  FiThumbsUp,
  FiThumbsDown,
  FiMessageSquare,
} from "react-icons/fi";

// Define TypeScript interfaces
interface UserData {
  username: string;
  displayName: string;
  bio: string;
  location: string;
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

// Mock data for demonstration
const userData: UserData = {
  username: "alexsmith",
  displayName: "Alex Smith",
  bio: "UI/UX Designer & Developer | Creating digital experiences that matter",
  location: "San Francisco, CA",
  joinDate: "May 2022",
  coverColor: "bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400",
  stats: {
    followers: 2458,
    following: 187,
    totalPosts: 143,
  },
  badges: [
    { name: "Pro", color: "bg-yellow-500" },
    { name: "Top", color: "bg-red-500" },
    { name: "Verified", color: "bg-blue-500" },
  ],
};

// Mock posts/activity data
const activityData: ActivityData = {
  overview: [
    {
      id: 1,
      type: "post",
      title: "Design Systems: Why They Matter",
      upvotes: 342,
      comments: 28,
      timestamp: "2 days ago",
      community: "DesignTalk",
    },
    {
      id: 2,
      type: "post",
      title: "The Future of UI Frameworks in 2023",
      upvotes: 271,
      comments: 42,
      timestamp: "1 week ago",
      community: "WebDev",
    },
    {
      id: 3,
      type: "comment",
      content:
        "This is exactly what I've been looking for. Thanks for sharing!",
      parentPost: "Figma Tips & Tricks",
      upvotes: 57,
      timestamp: "3 days ago",
      community: "FigmaMasters",
    },
  ],
  comments: [
    {
      id: 1,
      type: "comment",
      content:
        "Have you tried using auto layout for this? It would solve the responsive issues.",
      parentPost: "Struggling with responsive designs",
      upvotes: 89,
      timestamp: "1 day ago",
      community: "DesignTalk",
    },
    {
      id: 2,
      type: "comment",
      content:
        "The new API looks promising, but I'm concerned about backward compatibility.",
      parentPost: "React 19 Preview",
      upvotes: 42,
      timestamp: "3 days ago",
      community: "ReactJS",
    },
    {
      id: 3,
      type: "comment",
      content:
        "Here's a CodePen example I created that solves this exact problem: [link]",
      parentPost: "CSS Grid vs Flexbox",
      upvotes: 124,
      timestamp: "5 days ago",
      community: "FrontendDev",
    },
  ],
  saved: [
    {
      id: 1,
      type: "post",
      title: "Ultimate Guide to TypeScript in 2023",
      upvotes: 1247,
      comments: 87,
      timestamp: "2 weeks ago",
      community: "TypeScript",
    },
    {
      id: 2,
      type: "post",
      title: "How We Reduced Our Bundle Size by 70%",
      upvotes: 892,
      comments: 76,
      timestamp: "3 weeks ago",
      community: "WebPerformance",
    },
  ],
  hidden: [
    {
      id: 1,
      type: "post",
      title: "Another JavaScript Framework?",
      upvotes: 432,
      comments: 98,
      timestamp: "1 month ago",
      community: "JavaScript",
    },
  ],
  upvoted: [
    {
      id: 1,
      type: "post",
      title: "Color Theory for Digital Designers",
      upvotes: 765,
      comments: 43,
      timestamp: "1 week ago",
      community: "DesignTalk",
    },
    {
      id: 2,
      type: "comment",
      content:
        "Try using the new Container Queries, they're perfect for this use case.",
      parentPost: "Complex Responsive UI",
      upvotes: 102,
      timestamp: "2 weeks ago",
      community: "CSSMasters",
    },
  ],
  downvoted: [
    {
      id: 1,
      type: "post",
      title: "Why I Think SASS is Obsolete Now",
      upvotes: 213,
      comments: 154,
      timestamp: "2 weeks ago",
      community: "FrontendDev",
    },
  ],
};

// Tab interface type
type TabType =
  | "overview"
  | "comments"
  | "saved"
  | "hidden"
  | "upvoted"
  | "downvoted";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Function to render content based on active tab
  const renderContent = () => {
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
        {items.map((item) => (
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
                  <FiUser />
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
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition">
                      Follow
                    </button>
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
    </div>
  );
};

export default UserProfile;
