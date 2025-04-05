import React, { useState, useEffect, FormEvent, useRef } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineSearch,
  HiDotsVertical,
  HiOutlineUserAdd,
  HiX,
  HiOutlineUpload,
  HiOutlinePhotograph,
  HiOutlineFilm,
  HiTrash,
} from "react-icons/hi";
import { FiMessageSquare, FiHeart, FiEdit } from "react-icons/fi";
import { AiOutlineAudio } from "react-icons/ai";
import { BsEmojiSmile, BsChevronDown } from "react-icons/bs";

// Define types for our application
interface MediaFile {
  id: string;
  url: string;
  type: "image" | "video";
  filename?: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  date: string;
  likes: number;
  comments: number;
  mediaFiles: MediaFile[];
}

interface Community {
  id: number;
  name: string;
  description: string;
  members: number;
  joined: boolean;
  icon: string;
  posts: Post[];
}

interface PostWithCommunityInfo extends Post {
  communityName: string;
  communityIcon: string;
}

interface UploadFile {
  id: string;
  file: File;
  type: "image" | "video";
  preview: string;
}

// Mock data - replace with actual API calls
const MOCK_COMMUNITIES: Community[] = [
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
        mediaFiles: [],
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
        mediaFiles: [],
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
        mediaFiles: [],
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
        mediaFiles: [],
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
        mediaFiles: [],
      },
    ],
  },
];

function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>(MOCK_COMMUNITIES);
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
  const [newPostDescription, setNewPostDescription] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("general");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostSampleOutput, setNewPostSampleOutput] = useState("");
  const [newPostMediaFiles, setNewPostMediaFiles] = useState<UploadFile[]>([]);
  const [newCommunityName, setNewCommunityName] = useState("");
  const [newCommunityDescription, setNewCommunityDescription] = useState("");
  const [newCommunityIcon, setNewCommunityIcon] = useState("💬");

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add a state for the expanded post
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);

  // Filtered communities based on search
  const filteredCommunities = communities.filter((community) =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Simulate API call to fetch communities
  useEffect(() => {
    // In a real app, fetch communities from API
    // We need to cast MOCK_COMMUNITIES to ensure types match up
    setCommunities(MOCK_COMMUNITIES as Community[]);
  }, []);

  // Get posts from selected community or all communities if none selected
  const getPosts = (): PostWithCommunityInfo[] => {
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

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const allowedVideoTypes = ["video/mp4", "video/webm", "video/ogg"];

    Array.from(files).forEach((file) => {
      const fileType = file.type;
      const fileId = `file-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      if (allowedImageTypes.includes(fileType)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewPostMediaFiles((prev) => [
            ...prev,
            {
              id: fileId,
              file,
              type: "image",
              preview: reader.result as string,
            },
          ]);
        };
        reader.readAsDataURL(file);
      } else if (allowedVideoTypes.includes(fileType)) {
        setNewPostMediaFiles((prev) => [
          ...prev,
          {
            id: fileId,
            file,
            type: "video",
            preview: URL.createObjectURL(file),
          },
        ]);
      } else {
        alert(
          "Only image (JPEG, PNG, GIF, WebP) and video (MP4, WebM, OGG) files are supported"
        );
      }
    });

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove uploaded file
  const removeFile = (fileId: string) => {
    setNewPostMediaFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  // Create a new post
  const handleCreatePost = (e?: FormEvent) => {
    e?.preventDefault();

    if (
      !newPostTitle ||
      !newPostDescription ||
      !newPostCategory ||
      !newPostContent
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const communityToPostIn = selectedCommunity || communities[0].id;

    // Create mediaUrls array for the post
    const mediaUrls: MediaFile[] = newPostMediaFiles.map((file) => ({
      id: file.id,
      url: file.preview,
      type: file.type,
      filename: file.file.name,
    }));

    // Create new post object
    const newPost: Post = {
      id: Date.now(), // Use timestamp as temporary unique ID
      title: newPostTitle,
      content: `${newPostDescription}\n\n**Category:** ${newPostCategory}\n\n**Prompt:**\n\`\`\`\n${newPostContent}\n\`\`\`${
        newPostSampleOutput
          ? `\n\n**Sample Output:**\n${newPostSampleOutput}`
          : ""
      }`,
      author: "current_user", // In a real app, get from auth context
      authorAvatar: "https://i.pravatar.cc/150?img=8",
      date: "Just now",
      likes: 0,
      comments: 0,
      mediaFiles: mediaUrls,
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

    // Reset form fields
    setNewPostTitle("");
    setNewPostDescription("");
    setNewPostCategory("general");
    setNewPostContent("");
    setNewPostSampleOutput("");
    setNewPostMediaFiles([]);
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

  // Toggle expanded post
  const toggleExpandPost = (postId: number) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
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
                  <div
                    key={community.id}
                    className="p-4 border rounded-lg shadow-sm bg-white"
                  >
                    <div className="flex items-center mb-3">
                      <div className="mr-3 h-12 w-12 flex items-center justify-center text-3xl bg-gray-100 rounded-lg">
                        {community.icon}
                      </div>
                      <div>
                        <Link
                          to={`/community/${community.id}`}
                          className="text-xl font-semibold hover:text-blue-600 transition"
                        >
                          {community.name}
                        </Link>
                        <div className="flex mt-1">
                          <p className="text-sm text-gray-500">
                            {community.members.toLocaleString()} members
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
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
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition"
                onClick={() => toggleExpandPost(post.id)}
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

                {/* Collapsed preview */}
                {expandedPostId !== post.id && (
                  <div className="text-gray-700 mb-4">
                    <p className="line-clamp-3">
                      {post.content.split("\n\n")[0]}{" "}
                      {/* Only show first paragraph */}
                    </p>

                    {/* Preview badge */}
                    {post.content.includes("**Category:**") && (
                      <div className="mt-2">
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium mr-2">
                          {post.content
                            .split("**Category:**")[1]
                            .split("\n\n")[0]
                            .trim()}
                        </span>
                        <span className="text-sm text-gray-500">
                          Click to view full prompt
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Expanded post content */}
                {expandedPostId === post.id && (
                  <div className="text-gray-700 mb-4">
                    {post.content.split("\n\n").map((paragraph, idx) => {
                      if (paragraph.startsWith("**Category:**")) {
                        // Render category
                        return (
                          <div key={idx} className="my-2">
                            <span className="font-semibold">Category: </span>
                            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                              {paragraph.replace("**Category:**", "").trim()}
                            </span>
                          </div>
                        );
                      } else if (paragraph.startsWith("**Prompt:**")) {
                        // Render prompt with code formatting
                        const promptContent = paragraph
                          .replace("**Prompt:**", "")
                          .trim();
                        return (
                          <div key={idx} className="my-3">
                            <p className="font-semibold text-gray-700 mb-1">
                              Prompt:
                            </p>
                            <div className="bg-gray-50 border border-gray-200 rounded-md p-3 font-mono text-sm whitespace-pre-wrap overflow-auto">
                              {promptContent.replace(/```/g, "")}
                            </div>
                          </div>
                        );
                      } else if (paragraph.startsWith("**Sample Output:**")) {
                        // Render sample output
                        const sampleOutput = paragraph
                          .replace("**Sample Output:**", "")
                          .trim();
                        return (
                          <div key={idx} className="my-3">
                            <p className="font-semibold text-gray-700 mb-1">
                              Sample Output:
                            </p>
                            <div className="bg-gray-50 border border-gray-200 rounded-md p-3 whitespace-pre-wrap overflow-auto">
                              {sampleOutput}
                            </div>

                            {/* Render media files */}
                            {post.mediaFiles && post.mediaFiles.length > 0 && (
                              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {post.mediaFiles.map((mediaFile) => (
                                  <div
                                    key={mediaFile.id}
                                    className="relative rounded-md overflow-hidden border border-gray-200"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {mediaFile.type === "image" ? (
                                      <a
                                        href={mediaFile.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <img
                                          src={mediaFile.url}
                                          alt={mediaFile.filename || "Image"}
                                          className="w-full h-40 object-cover"
                                        />
                                      </a>
                                    ) : (
                                      <video
                                        src={mediaFile.url}
                                        className="w-full h-40 object-cover"
                                        controls
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                                      {mediaFile.filename ||
                                        (mediaFile.type === "image"
                                          ? "Image"
                                          : "Video")}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      } else {
                        // Render regular paragraph (description)
                        return (
                          <p key={idx} className="my-2">
                            {paragraph}
                          </p>
                        );
                      }
                    })}
                  </div>
                )}

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <button
                    className="flex items-center hover:bg-gray-100 px-2 py-1 rounded"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FiHeart className="w-4 h-4 mr-1" />
                    <span>{post.likes}</span>
                  </button>
                  <button
                    className="flex items-center hover:bg-gray-100 px-2 py-1 rounded"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FiMessageSquare className="w-4 h-4 mr-1" />
                    <span>{post.comments}</span>
                  </button>
                  <button
                    className="flex items-center hover:bg-gray-100 px-2 py-1 rounded"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <AiOutlineAudio className="w-4 h-4 mr-1" />
                    <span>Audio</span>
                  </button>
                  <button
                    className="flex items-center hover:bg-gray-100 px-2 py-1 rounded"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <BsEmojiSmile className="w-4 h-4" />
                  </button>
                  <div className="ml-auto">
                    <button
                      className="hover:bg-gray-100 p-1 rounded"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <HiDotsVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Comment form - always shown when expanded */}
                {expandedPostId === post.id && (
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
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Comment box */}
                {expandedPostId === post.id && post.comments > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-3">
                      Comments ({post.comments})
                    </h4>
                    <div className="space-y-3">
                      {/* Sample comments - in a real app, you'd fetch these from the API */}
                      <div className="flex">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          <img
                            src="https://i.pravatar.cc/150?img=1"
                            alt="Commenter avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="bg-gray-50 p-2 rounded-lg">
                            <div className="flex items-center mb-1">
                              <span className="font-medium text-sm">
                                user123
                              </span>
                              <span className="mx-1">•</span>
                              <span className="text-xs text-gray-500">
                                2 days ago
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">
                              This is really helpful, thanks for sharing!
                            </p>
                          </div>
                          <div className="flex items-center mt-1 text-xs text-gray-500 space-x-2">
                            <button
                              className="hover:text-gray-700"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Like
                            </button>
                            <button
                              className="hover:text-gray-700"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {post.comments > 1 && (
                      <button
                        className="mt-3 text-blue-600 text-sm font-medium hover:text-blue-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View all comments
                      </button>
                    )}
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
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10 flex justify-between items-center">
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
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter a title for your prompt"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newPostDescription}
                  onChange={(e) => setNewPostDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                  placeholder="Briefly describe what this prompt does and how to use it"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="general">General</option>
                  <option value="creative-writing">Creative Writing</option>
                  <option value="image-generation">Image Generation</option>
                  <option value="coding">Coding</option>
                  <option value="data-analysis">Data Analysis</option>
                  <option value="marketing">Marketing</option>
                  <option value="education">Education</option>
                  <option value="business">Business</option>
                  <option value="personal">Personal</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prompt Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px] font-mono text-sm"
                  placeholder="Paste or type your full prompt text here"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  This is the exact prompt text that would be sent to the AI
                  model.
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sample Output{" "}
                  <span className="text-xs text-gray-500">(Optional)</span>
                </label>
                <textarea
                  value={newPostSampleOutput}
                  onChange={(e) => setNewPostSampleOutput(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                  placeholder="Share an example of the output generated using this prompt"
                />

                {/* Media file upload section */}
                <div className="mt-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      Add Media Files
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/ogg"
                      className="hidden"
                      multiple
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                    >
                      <HiOutlineUpload className="w-4 h-4 mr-1" />
                      Upload
                    </button>
                  </div>

                  {/* Display uploaded files preview */}
                  {newPostMediaFiles.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-500 mb-2">
                        {newPostMediaFiles.length} file(s) uploaded
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {newPostMediaFiles.map((file) => (
                          <div
                            key={file.id}
                            className="relative group border border-gray-200 rounded-md overflow-hidden"
                          >
                            {file.type === "image" ? (
                              <img
                                src={file.preview}
                                alt={file.file.name}
                                className="w-full h-24 object-cover"
                              />
                            ) : (
                              <div className="w-full h-24 bg-gray-100 flex flex-col items-center justify-center">
                                <HiOutlineFilm className="w-8 h-8 text-gray-400" />
                                <span className="text-xs text-gray-500 mt-1 px-2 truncate w-full text-center">
                                  {file.file.name}
                                </span>
                              </div>
                            )}

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => removeFile(file.id)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove file"
                            >
                              <HiTrash className="w-4 h-4" />
                            </button>

                            {/* File type indicator */}
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-[10px] p-1">
                              {file.type === "image" ? (
                                <div className="flex items-center">
                                  <HiOutlinePhotograph className="w-3 h-3 mr-1" />
                                  <span className="truncate">
                                    {file.file.name}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <HiOutlineFilm className="w-3 h-3 mr-1" />
                                  <span className="truncate">
                                    {file.file.name}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="mt-1 text-xs text-gray-500">
                    Supported formats: JPEG, PNG, GIF, WebP, MP4, WebM, OGG
                  </p>
                </div>
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
