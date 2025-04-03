import { useState } from "react";
import PostCard from "../components/PostCard";
import SidebarSection from "../components/SidebarSection";
import PostForm from "../components/PostForm";
import { IoAddOutline } from "react-icons/io5";

interface Post {
  id: string;
  title: string;
  content: string;
  files: File[];
  timestamp: number;
}

export default function HomePage() {
  const [showPostForm, setShowPostForm] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  // Sample data for hot topics
  const hotTopics = [
    {
      id: 1,
      subreddit: "r/webdev",
      title: "Even Karpathy Finds It Hard",
      upvotes: 1400,
      comments: 307,
    },
    {
      id: 2,
      subreddit: "r/developersIndia",
      title:
        "2cr PA at 30 years. Worked in FAANG companies and startups over the years.",
      upvotes: 58,
      comments: 25,
    },
    {
      id: 3,
      subreddit: "r/GYM",
      title:
        "How's my form now that I upped weight by 20lbs and changed my shorts",
      upvotes: 148,
      comments: 14,
    },
  ];

  // Sample data for recommended
  const recommended = [
    {
      id: 1,
      subreddit: "r/microsaas",
      title: "Would You Use an App to Save and Share AI Prompts?",
      upvotes: 4,
      comments: 2,
    },
    {
      id: 2,
      subreddit: "r/SaaS",
      title: "Would You Use an App to Save and Share AI Prompts?",
      upvotes: 3,
      comments: 0,
    },
    {
      id: 3,
      subreddit: "r/SideProject",
      title: "Would You Use an App to Save and Share AI Prompts?",
      upvotes: 2,
      comments: 0,
    },
    {
      id: 4,
      subreddit: "r/startup",
      title: "Would You Use an App to Save and Share AI Prompts?",
      upvotes: 1,
      comments: 0,
    },
    {
      id: 5,
      subreddit: "r/Startup_Ideas",
      title: "Would You Use an App to Save and Share AI Prompts?",
      upvotes: 5,
      comments: 12,
    },
  ];

  const handleNewPost = (postData: {
    title: string;
    content: string;
    files: File[];
  }) => {
    const newPost: Post = {
      id: Date.now().toString(),
      ...postData,
      timestamp: Date.now(),
    };
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setShowPostForm(false);
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 px-4 lg:px-6">
        {/* Main content - wider on larger screens */}
        <div className="w-full lg:w-8/12 xl:w-9/12">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              title={post.title}
              content={post.content}
              files={post.files}
              timestamp={post.timestamp}
            />
          ))}
          <PostCard />
        </div>

        <aside className="hidden lg:block lg:w-4/12 xl:w-3/12">
          <div className="space-y-4">
            <SidebarSection title="Hot Topics" items={hotTopics} />
            <SidebarSection title="Recommended" items={recommended} />
          </div>
        </aside>
      </div>

      {/* Sticky Post Button */}
      <button
        onClick={() => setShowPostForm(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors z-40"
      >
        <IoAddOutline className="w-8 h-8" />
      </button>

      {/* Post Form Modal */}
      {showPostForm && (
        <PostForm
          onSubmit={handleNewPost}
          onClose={() => setShowPostForm(false)}
        />
      )}
    </div>
  );
}
