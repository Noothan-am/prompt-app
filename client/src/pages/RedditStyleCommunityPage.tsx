import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  HiOutlinePencil,
  HiOutlineRefresh,
  HiOutlineDotsVertical,
  HiOutlineUserAdd,
  HiPaperAirplane,
} from "react-icons/hi";
import {
  FiMessageSquare,
  FiHeart,
  FiShare2,
  FiArrowDown,
  FiArrowUp,
} from "react-icons/fi";
import {
  BsEmojiSmile,
  BsStars,
  BsFilterLeft,
  BsFacebook,
  BsTwitter,
} from "react-icons/bs";
import { AiOutlineAudio } from "react-icons/ai";

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  timestamp: string;
  upvotes: number;
  comments: number;
  tags?: string[];
  isPinned?: boolean;
  isUpvoted?: boolean;
  isDownvoted?: boolean;
  media?: {
    type: "image" | "video";
    url: string;
  };
}

interface Moderator {
  id: number;
  name: string;
  avatar: string;
  role: string;
  joined?: string;
  posts?: number;
}

interface CommunityRule {
  id: number;
  title: string;
  description: string;
}

interface CommunityGuide {
  id: number;
  title: string;
  url: string;
}

interface CommunityData {
  id: string;
  name: string;
  handle: string;
  description: string;
  coverImage: string;
  icon: string;
  members: number;
  online: number;
  createdAt: string;
  totalPosts: number;
  totalFollowers: number;
  views: number;
  rules: CommunityRule[];
  guides: CommunityGuide[];
  posts: Post[];
  moderators: Moderator[];
  tags: string[];
  isJoined: boolean;
}

const RedditStyleCommunityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [communityData, setCommunityData] = useState<CommunityData | null>(
    null
  );
  const [sortBy, setSortBy] = useState<string>("hot");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulating API fetch
    const fetchCommunityData = () => {
      setIsLoading(true);

      // Mock data based on the image
      const mockData: CommunityData = {
        id: id || "1",
        name: "developersworld",
        handle: "r/developersworld",
        description:
          "A community for developers to share knowledge, collaborate on projects, and discuss the latest technologies and tools in software development.",
        coverImage: "https://picsum.photos/id/1/1200/300",
        icon: "https://picsum.photos/id/237/150/150",
        members: 1204,
        online: 42,
        totalPosts: 932,
        totalFollowers: 1204,
        views: 5732,
        createdAt: "Jan 12, 2023",
        tags: ["Programming", "Web Development", "Mobile", "AI", "DevOps"],
        isJoined: false,
        posts: [
          {
            id: 1,
            title: "Would You Use an App to Save and Share AI Prompts?",
            content:
              "Hey everyone! 😊 I'm thinking about building an app for people who love working with AI tools. Here's the idea:\n\n• You can save your best prompts and organize them by category.\n• Share your prompts with others or keep them private.\n• Get feedback or suggestions on how to improve your prompts.\n• Find new, popular prompts that others are using.\n• Collaborate with others to refine prompts together....",
            author: "u/Able-Ad-6238",
            authorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
            timestamp: "16 days ago",
            upvotes: 1,
            comments: 0,
            isPinned: false,
            isUpvoted: true,
          },
          {
            id: 2,
            title:
              "I have an interview with ANZ India through a graduate program on March, anyone able to share tips?",
            content:
              "I'll be interviewing for a software engineering role at ANZ India next month. This is my first major interview and I'm a bit nervous. Has anyone gone through their process before? What kind of technical questions do they ask? Any advice would be appreciated!",
            author: "u/Able-Ad-6238",
            authorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
            timestamp: "2 months ago",
            upvotes: 5,
            comments: 3,
            tags: ["Interview", "Banking", "Graduate"],
          },
          {
            id: 3,
            title:
              "Just launched my first React Native app! Here's what I learned",
            content:
              "After 6 months of learning and development, I finally published my first React Native app to both app stores! I documented my entire journey and the key challenges I faced. Main takeaways: 1) Setting up CI/CD early saved me tons of time, 2) Testing on real devices is essential - simulators aren't enough, 3) Managing state is still the hardest part...",
            author: "u/mobileDev42",
            authorAvatar: "https://randomuser.me/api/portraits/women/22.jpg",
            timestamp: "3 days ago",
            upvotes: 127,
            comments: 42,
            media: {
              type: "image",
              url: "https://picsum.photos/id/180/800/400",
            },
          },
        ],
        moderators: [
          {
            id: 1,
            name: "u/Able-Ad-6238",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            role: "Admin",
            joined: "Jan 12, 2023",
            posts: 47,
          },
          {
            id: 2,
            name: "u/mobileDev42",
            avatar: "https://randomuser.me/api/portraits/women/22.jpg",
            role: "Moderator",
            joined: "Feb 15, 2023",
            posts: 28,
          },
        ],
        rules: [
          {
            id: 1,
            title: "Be respectful and helpful",
            description:
              "Treat others as you would like to be treated. No harassment, bullying, or hate speech.",
          },
          {
            id: 2,
            title: "No self-promotion",
            description:
              "Don't post links to your own content just to gain traffic or followers.",
          },
          {
            id: 3,
            title: "Use descriptive titles",
            description:
              "Post titles should clearly describe what your post is about.",
          },
        ],
        guides: [
          {
            id: 1,
            title: "Community Guide",
            url: "/community-guide",
          },
          {
            id: 2,
            title: "Code of Conduct",
            url: "/code-of-conduct",
          },
        ],
      };

      setCommunityData(mockData);
      setIsLoading(false);
    };

    fetchCommunityData();
  }, [id]);

  const handleVote = (postId: number, direction: "up" | "down") => {
    if (!communityData) return;

    setCommunityData((prev) => {
      if (!prev) return prev;

      const updatedPosts = prev.posts.map((post) => {
        if (post.id === postId) {
          if (direction === "up") {
            // If already upvoted, remove upvote, else add upvote
            const changeValue = post.isUpvoted ? -1 : 1;
            return {
              ...post,
              upvotes: post.upvotes + changeValue,
              isUpvoted: !post.isUpvoted,
              isDownvoted: false,
            };
          } else {
            // If already downvoted, remove downvote, else add downvote
            const changeValue = post.isDownvoted ? 1 : -1;
            return {
              ...post,
              upvotes: post.upvotes + changeValue,
              isDownvoted: !post.isDownvoted,
              isUpvoted: false,
            };
          }
        }
        return post;
      });

      return {
        ...prev,
        posts: updatedPosts,
      };
    });
  };

  const joinCommunity = () => {
    setCommunityData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        isJoined: !prev.isJoined,
        members: prev.isJoined ? prev.members - 1 : prev.members + 1,
      };
    });
  };

  if (isLoading || !communityData) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Header */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600">
          <img
            src={communityData.coverImage}
            alt="Cover"
            className="w-full h-full object-cover opacity-70"
          />
        </div>

        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-end -mt-5 pb-3 relative z-10">
            <div className="mr-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white bg-white">
                <img
                  src={communityData.icon}
                  alt={communityData.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{communityData.handle}</h1>
                <p className="text-gray-600 text-sm">r/{communityData.name}</p>
              </div>

              <div className="mt-2 md:mt-0">
                <button
                  onClick={joinCommunity}
                  className={`px-4 py-1.5 rounded-full font-medium text-sm ${
                    communityData.isJoined
                      ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {communityData.isJoined ? "Joined" : "Join"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 pt-4 pb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Posts */}
        <div className="md:col-span-2 space-y-4">
          {/* Create Post Box */}
          <div className="bg-white rounded-md p-2 shadow border border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-2">
                <img
                  src="https://randomuser.me/api/portraits/women/32.jpg"
                  alt="Your avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <input
                type="text"
                placeholder="Create Post"
                className="flex-1 bg-gray-100 text-gray-700 rounded-md px-4 py-2 text-sm border border-gray-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Sort Options */}
          <div className="bg-white rounded-md p-2 flex items-center shadow border border-gray-200">
            <button
              className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium mr-2 ${
                sortBy === "hot"
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setSortBy("hot")}
            >
              <BsStars className="mr-1.5" /> Hot
            </button>
            <button
              className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium mr-2 ${
                sortBy === "new"
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setSortBy("new")}
            >
              <HiOutlineRefresh className="mr-1.5" /> New
            </button>
            <button
              className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                sortBy === "top"
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setSortBy("top")}
            >
              <BsFilterLeft className="mr-1.5" /> Top
            </button>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {communityData.posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-md p-3 shadow border border-gray-200"
              >
                {/* Post Header */}
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                    <img
                      src={post.authorAvatar}
                      alt={post.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    <span className="text-gray-700">{post.author}</span>
                    <span className="mx-1">•</span>
                    <span>{post.timestamp}</span>
                  </div>
                  {post.isPinned && (
                    <div className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-blue-100 text-blue-700">
                      PINNED
                    </div>
                  )}
                </div>

                {/* Post Content */}
                <h2 className="text-lg font-medium mb-2">{post.title}</h2>
                <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                  {post.content}
                </p>

                {/* Post Media */}
                {post.media && (
                  <div className="mb-3 rounded-md overflow-hidden border border-gray-200">
                    {post.media.type === "image" ? (
                      <img
                        src={post.media.url}
                        alt="Post media"
                        className="w-full max-h-80 object-cover"
                      />
                    ) : (
                      <video
                        src={post.media.url}
                        controls
                        className="w-full max-h-80 object-cover"
                      />
                    )}
                  </div>
                )}

                {/* Post Tags */}
                {post.tags && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center text-gray-600 text-sm">
                  <div className="flex items-center border border-gray-200 rounded-full px-2 py-1 mr-2">
                    <button
                      className={`p-1 rounded-full ${
                        post.isUpvoted ? "text-orange-500" : ""
                      }`}
                      onClick={() => handleVote(post.id, "up")}
                    >
                      <FiArrowUp className="w-4 h-4" />
                    </button>
                    <span className="mx-1 font-medium">{post.upvotes}</span>
                    <button
                      className={`p-1 rounded-full ${
                        post.isDownvoted ? "text-blue-500" : ""
                      }`}
                      onClick={() => handleVote(post.id, "down")}
                    >
                      <FiArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                  <button className="flex items-center hover:bg-gray-100 px-2 py-1 rounded-full">
                    <FiMessageSquare className="w-4 h-4 mr-1" />
                    <span>{post.comments}</span>
                  </button>
                  <button className="flex items-center hover:bg-gray-100 px-2 py-1 rounded-full ml-2">
                    <FiShare2 className="w-4 h-4 mr-1" />
                    <span>Share</span>
                  </button>
                  <button className="flex items-center hover:bg-gray-100 px-2 py-1 rounded-full ml-2">
                    <AiOutlineAudio className="w-4 h-4 mr-1" />
                    <span>Audio</span>
                  </button>
                  <button className="flex items-center hover:bg-gray-100 px-2 py-1 rounded-full ml-2">
                    <BsEmojiSmile className="w-4 h-4" />
                  </button>
                  <button className="flex items-center hover:bg-gray-100 p-1 rounded-full ml-auto">
                    <HiOutlineDotsVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-4">
          {/* About Community */}
          <div className="bg-white rounded-md overflow-hidden shadow border border-gray-200">
            <div className="bg-blue-600 p-3 font-medium text-white">
              About Community
            </div>
            <div className="p-3">
              <p className="text-sm text-gray-700 mb-4">
                {communityData.description}
              </p>

              <div className="flex items-center mb-4">
                <HiOutlinePencil className="text-gray-500 mr-2" />
                <div className="text-sm">
                  <div className="text-gray-700">Created</div>
                  <div className="text-gray-500">{communityData.createdAt}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="text-sm">
                  <div className="text-gray-700">Total Posts</div>
                  <div className="text-gray-500">
                    {communityData.totalPosts}
                  </div>
                </div>
                <div className="text-sm">
                  <div className="text-gray-700">Total Views</div>
                  <div className="text-gray-500">{communityData.views}</div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 mb-3">
                <div className="flex justify-around">
                  <div className="text-center">
                    <div className="text-lg font-medium">
                      {communityData.members}
                    </div>
                    <div className="text-xs text-gray-500">Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-medium">
                      {communityData.online}
                      <span className="ml-1.5 inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    </div>
                    <div className="text-xs text-gray-500">Online</div>
                  </div>
                </div>
              </div>

              {/* Community tags */}
              {communityData.tags && communityData.tags.length > 0 && (
                <div className="mb-4">
                  <div className="text-gray-700 text-sm mb-2">Topics</div>
                  <div className="flex flex-wrap gap-2">
                    {communityData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={joinCommunity}
                className={`w-full py-2 rounded-full font-medium text-sm ${
                  communityData.isJoined
                    ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {communityData.isJoined ? "Joined" : "Join Community"}
              </button>

              <div className="flex justify-between mt-3">
                <button className="flex-1 mr-2 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700">
                  <BsFacebook className="inline-block mr-1" /> Share
                </button>
                <button className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700">
                  <BsTwitter className="inline-block mr-1" /> Tweet
                </button>
              </div>
            </div>
          </div>

          {/* Community Rules */}
          <div className="bg-white rounded-md overflow-hidden shadow border border-gray-200">
            <div className="p-3 font-medium border-b border-gray-200 text-gray-800">
              r/{communityData.name} Rules
            </div>
            <div className="p-3">
              <div className="space-y-3">
                {communityData.rules.map((rule, index) => (
                  <div key={rule.id}>
                    <div className="flex items-start">
                      <span className="font-medium text-sm mr-2 text-gray-800">
                        {index + 1}.
                      </span>
                      <div>
                        <h4 className="font-medium text-sm text-gray-800">
                          {rule.title}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {rule.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full text-blue-600 text-sm font-medium py-2 hover:underline mt-2">
                View All Rules
              </button>
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="bg-white rounded-md overflow-hidden shadow border border-gray-200">
            <div className="p-3 font-medium border-b border-gray-200 text-gray-800">
              Community Guidelines
            </div>
            <div className="p-3">
              <div className="space-y-3">
                <div className="text-sm text-gray-700">
                  <p className="mb-2">The following actions are not allowed:</p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-500">
                    <li>Posting personal information without consent</li>
                    <li>Harassment of other community members</li>
                    <li>Spam or excessive self-promotion</li>
                    <li>
                      Posting content that violates the rules of the platform
                    </li>
                  </ul>
                </div>
              </div>
              <button className="w-full text-blue-600 text-sm font-medium py-2 hover:underline mt-2">
                View Full Guidelines
              </button>
            </div>
          </div>

          {/* Moderators */}
          <div className="bg-white rounded-md overflow-hidden shadow border border-gray-200">
            <div className="p-3 font-medium border-b border-gray-200 text-gray-800">
              Moderators
            </div>
            <div className="p-3">
              {communityData.moderators.map((mod) => (
                <div
                  key={mod.id}
                  className="flex items-center justify-between mb-3"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                      <img
                        src={mod.avatar}
                        alt={mod.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-700">{mod.name}</div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded mr-2">
                          {mod.role}
                        </span>
                        {mod.joined && <span>Joined: {mod.joined}</span>}
                      </div>
                    </div>
                  </div>
                  {mod.posts && (
                    <div className="text-xs text-gray-500">
                      {mod.posts} posts
                    </div>
                  )}
                </div>
              ))}
              <button className="w-full text-blue-600 text-sm font-medium py-2 hover:underline mt-2">
                Message Mods
              </button>
              <button className="w-full text-blue-600 text-sm font-medium py-2 hover:underline">
                View All Moderators
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedditStyleCommunityPage;
