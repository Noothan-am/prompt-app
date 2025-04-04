import React, { useState, useEffect, FormEvent } from "react";
import {
  HiOutlineSearch,
  HiDotsVertical,
  HiOutlineUserAdd,
  HiX,
} from "react-icons/hi";
import { FiMessageSquare, FiHeart, FiEdit } from "react-icons/fi";
import { AiOutlineAudio } from "react-icons/ai";
import { BsEmojiSmile, BsChevronDown } from "react-icons/bs";

// Mock data - replace with actual API calls
const MOCK_COMMUNITIES = [
  {
    id: 1,
    name: "AI Enthusiasts",
    description:
      "A community for AI enthusiasts to share and discuss the latest AI trends and tools.",
    members: 2453,
    joined: true,
    icon: "🤖",
    posts: [
      {
        id: 101,
        title: "New GPT model released",
        content:
          "OpenAI just released their latest model with improved capabilities...",
        author: "ai_researcher",
        authorAvatar: "https://i.pravatar.cc/150?img=1",
        date: "2 hours ago",
        likes: 45,
        comments: 12,
      },
      {
        id: 102,
        title: "Prompt engineering techniques",
        content:
          "Here's a collection of effective prompt engineering techniques I've discovered...",
        author: "prompt_master",
        authorAvatar: "https://i.pravatar.cc/150?img=2",
        date: "1 day ago",
        likes: 89,
        comments: 24,
      },
    ],
  },
  {
    id: 2,
    name: "Prompt Crafters",
    description:
      "Share your best prompts and collaborate with others to create better results.",
    members: 1856,
    joined: true,
    icon: "✍️",
    posts: [
      {
        id: 201,
        title: "Image generation prompt template",
        content:
          "I've created a template that consistently produces great images...",
        author: "creative_mind",
        authorAvatar: "https://i.pravatar.cc/150?img=3",
        date: "5 hours ago",
        likes: 76,
        comments: 18,
      },
    ],
  },
  {
    id: 3,
    name: "Tech Innovations",
    description:
      "Discussing the latest tech innovations and their implications.",
    members: 3241,
    joined: true,
    icon: "💡",
    posts: [
      {
        id: 301,
        title: "The future of AR interfaces",
        content: "Augmented reality interfaces are evolving rapidly...",
        author: "future_tech",
        authorAvatar: "https://i.pravatar.cc/150?img=4",
        date: "3 days ago",
        likes: 112,
        comments: 35,
      },
    ],
  },
  {
    id: 4,
    name: "Developersworld",
    description:
      "A community for developers to share knowledge and collaborate.",
    members: 4521,
    joined: true,
    icon: "👨‍💻",
    posts: [
      {
        id: 401,
        title: "Would You Use an App to Save and Share AI Prompts?",
        content:
          "Hey everyone! 😊 I'm thinking about building an app for people who love working with AI tools. Here's the idea:\n\n• You can save your best prompts and organize them by category.\n• Share your prompts with others or keep them private.\n• Get feedback or suggestions on how to improve your prompts.\n• Find new, popular prompts that others are using.\n• Collaborate with others to refine prompts together...",
        author: "u/Able-Ad-6238",
        authorAvatar: "https://i.pravatar.cc/150?img=5",
        date: "15 days ago",
        likes: 1,
        comments: 0,
      },
    ],
  },
];

function CommunitiesPage() {
  const [communities, setCommunities] = useState(MOCK_COMMUNITIES);
  const [selectedCommunity, setSelectedCommunity] = useState<number | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("hot");

  // Modal states
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showCreateCommunityModal, setShowCreateCommunityModal] =
    useState(false);

  // Form states
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newCommunityName, setNewCommunityName] = useState("");
  const [newCommunityDescription, setNewCommunityDescription] = useState("");
  const [newCommunityIcon, setNewCommunityIcon] = useState("💬");

  // Filtered communities based on search
  const filteredCommunities = communities.filter((community) =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Simulate API call to fetch communities
  useEffect(() => {
    // In a real app, fetch communities from API
    // Example: fetch('/api/communities').then(res => res.json()).then(data => setCommunities(data));
    setCommunities(MOCK_COMMUNITIES);
  }, []);

  // Get posts from selected community or all communities if none selected
  const getPosts = () => {
    if (selectedCommunity === null) {
      return communities.flatMap((community) =>
        community.posts.map((post) => ({
          ...post,
          communityName: community.name,
          communityIcon: community.icon,
        }))
      );
    }

    const community = communities.find((c) => c.id === selectedCommunity);
    return community
      ? community.posts.map((post) => ({
          ...post,
          communityName: community.name,
          communityIcon: community.icon,
        }))
      : [];
  };

  // Create a new post
  const handleCreatePost = (e?: FormEvent) => {
    e?.preventDefault();

    if (!newPostTitle || !newPostContent) {
      alert("Please fill in all fields");
      return;
    }

    const communityToPostIn = selectedCommunity || communities[0].id;

    // Create new post object
    const newPost = {
      id: Date.now(), // Use timestamp as temporary unique ID
      title: newPostTitle,
      content: newPostContent,
      author: "current_user", // In a real app, get from auth context
      authorAvatar: "https://i.pravatar.cc/150?img=8",
      date: "Just now",
      likes: 0,
      comments: 0,
    };

    // Update communities state by adding the new post
    const updatedCommunities = communities.map((community) => {
      if (community.id === communityToPostIn) {
        return {
          ...community,
          posts: [newPost, ...community.posts],
        };
      }
      return community;
    });

    setCommunities(updatedCommunities);
    setNewPostTitle("");
    setNewPostContent("");
    setShowCreatePostModal(false);
  };

  // Create a new community
  const handleCreateCommunity = (e?: FormEvent) => {
    e?.preventDefault();

    if (!newCommunityName || !newCommunityDescription) {
      alert("Please fill in all required fields");
      return;
    }

    // Create new community object
    const newCommunity = {
      id: communities.length + 1, // Simple ID generation for demo
      name: newCommunityName,
      description: newCommunityDescription,
      members: 1, // Start with creator as member
      joined: true,
      icon: newCommunityIcon,
      posts: [], // Start with no posts
    };

    // Add new community to state
    setCommunities([...communities, newCommunity]);

    // Reset form fields
    setNewCommunityName("");
    setNewCommunityDescription("");
    setNewCommunityIcon("💬");
    setShowCreateCommunityModal(false);

    // Select the newly created community
    setSelectedCommunity(newCommunity.id);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Top section with community name and details - visible when community is selected */}
        {selectedCommunity !== null && (
          <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
            <div className="flex items-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-50 text-3xl mr-4">
                {communities.find((c) => c.id === selectedCommunity)?.icon}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">
                  {communities.find((c) => c.id === selectedCommunity)?.name}
                </h1>
                <p className="text-gray-600">
                  {
                    communities.find((c) => c.id === selectedCommunity)
                      ?.description
                  }
                </p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <span className="inline-flex items-center">
                    <span className="font-medium">
                      {communities
                        .find((c) => c.id === selectedCommunity)
                        ?.members.toLocaleString()}
                    </span>
                    <span className="ml-1">members</span>
                  </span>
                  <span className="mx-2">•</span>
                  <span>Created Jan 12, 2023</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                  Join
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <HiDotsVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left sidebar - Communities */}
          <div className="lg:sticky lg:top-6 lg:self-start bg-white rounded-lg shadow-sm border border-gray-200 h-fit overflow-hidden">
            {/* Community header */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Communities</h2>
              <div className="mt-3 relative">
                <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search communities"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-gray-300"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <HiX className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* All Communities option */}
            <div>
              <button
                onClick={() => setSelectedCommunity(null)}
                className={`w-full flex items-center px-4 py-3 hover:bg-gray-100 ${
                  selectedCommunity === null
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : ""
                }`}
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white mr-3">
                  #
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">All Communities</div>
                </div>
              </button>
            </div>

            {/* Community list - Now filtered by search */}
            <div className="max-h-[calc(100vh-20rem)] overflow-y-auto">
              {filteredCommunities.length > 0 ? (
                filteredCommunities.map((community) => (
                  <button
                    key={community.id}
                    onClick={() => setSelectedCommunity(community.id)}
                    className={`w-full flex items-center px-4 py-3 hover:bg-gray-100 ${
                      selectedCommunity === community.id
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : ""
                    }`}
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-xl mr-3">
                      {community.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{community.name}</div>
                      <div className="text-xs text-gray-500">
                        {community.members.toLocaleString()} members
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="py-4 px-6 text-center text-gray-500">
                  No communities found matching "{searchQuery}"
                </div>
              )}
            </div>

            {/* Create community button */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setShowCreateCommunityModal(true)}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <HiOutlineUserAdd className="w-5 h-5 mr-2" />
                Create Community
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-4 overflow-y-auto">
            {/* Sorting options */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSortBy("hot")}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      sortBy === "hot"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Hot
                  </button>
                  <button
                    onClick={() => setSortBy("new")}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      sortBy === "new"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    New
                  </button>
                  <button
                    onClick={() => setSortBy("top")}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      sortBy === "top"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Top
                  </button>
                </div>
                <button
                  onClick={() => setShowCreatePostModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition flex items-center"
                >
                  <FiEdit className="w-4 h-4 mr-2" />
                  Create Post
                </button>
              </div>
            </div>

            {/* No posts message */}
            {getPosts().length === 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="text-2xl mb-2">📭</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  No posts to display
                </h3>
                <p className="text-gray-600 mb-4">
                  {selectedCommunity
                    ? "Be the first to post in this community!"
                    : "Join some communities to see posts here!"}
                </p>
                <button
                  onClick={() => setShowCreatePostModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Create a post
                </button>
              </div>
            )}

            {/* Posts */}
            {getPosts().map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-xl mr-2">
                    {post.communityIcon}
                  </div>
                  <div className="mr-2">
                    <span className="font-medium text-blue-600">
                      {post.communityName}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>•</span>
                    <span className="ml-2">Posted by @{post.author}</span>
                    <span className="mx-1">•</span>
                    <span>{post.date}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-700 mb-4 whitespace-pre-line">
                  {post.content}
                </p>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <button className="flex items-center hover:bg-gray-100 px-2 py-1 rounded">
                    <FiHeart className="w-4 h-4 mr-1" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center hover:bg-gray-100 px-2 py-1 rounded">
                    <FiMessageSquare className="w-4 h-4 mr-1" />
                    <span>{post.comments}</span>
                  </button>
                  <button className="flex items-center hover:bg-gray-100 px-2 py-1 rounded">
                    <AiOutlineAudio className="w-4 h-4 mr-1" />
                    <span>Audio</span>
                  </button>
                  <button className="flex items-center hover:bg-gray-100 px-2 py-1 rounded">
                    <BsEmojiSmile className="w-4 h-4" />
                  </button>
                  <div className="ml-auto">
                    <button className="hover:bg-gray-100 p-1 rounded">
                      <HiDotsVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Comment box */}
                {post.comments > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        <img
                          src="https://i.pravatar.cc/150?img=8"
                          alt="Your avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          className="w-full p-2 bg-gray-100 rounded-lg border border-transparent focus:outline-none focus:border-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Create Post</h3>
              <button
                onClick={() => setShowCreatePostModal(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <HiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleCreatePost} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Community
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedCommunity || communities[0]?.id || ""}
                  onChange={(e) => setSelectedCommunity(Number(e.target.value))}
                  required
                >
                  {communities.map((community) => (
                    <option key={community.id} value={community.id}>
                      {community.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Post title"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
                  placeholder="Write your post here..."
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreatePostModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Community Modal */}
      {showCreateCommunityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Create Community</h3>
              <button
                onClick={() => setShowCreateCommunityModal(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <HiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleCreateCommunity} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full text-2xl">
                    {newCommunityIcon}
                  </div>
                  <select
                    value={newCommunityIcon}
                    onChange={(e) => setNewCommunityIcon(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[
                      "💬",
                      "🤖",
                      "💡",
                      "✍️",
                      "👨‍💻",
                      "🎮",
                      "📚",
                      "🎨",
                      "🔬",
                      "💼",
                    ].map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newCommunityName}
                  onChange={(e) => setNewCommunityName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Community name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newCommunityDescription}
                  onChange={(e) => setNewCommunityDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  placeholder="Describe your community..."
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateCommunityModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommunitiesPage;
