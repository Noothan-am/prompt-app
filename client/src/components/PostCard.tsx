import React, { useState, useEffect, useRef } from "react";

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: number;
}

interface PostData {
  id: string;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  userVote?: "up" | "down" | null;
}

function PostCard() {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [postData, setPostData] = useState<PostData>({
    id: "post1",
    upvotes: 58,
    downvotes: 0,
    comments: [],
    userVote: null,
  });

  // Reference to the comment section
  const commentSectionRef = useRef<HTMLDivElement>(null);
  const commentButtonRef = useRef<HTMLButtonElement>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(`post_${postData.id}`);
    if (savedData) {
      setPostData(JSON.parse(savedData));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`post_${postData.id}`, JSON.stringify(postData));
  }, [postData]);

  // Handle click outside of comment section
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Only process if comments are shown
      if (!showComments) return;

      // Check if the click was outside both the comment section and the comment button
      if (
        commentSectionRef.current &&
        !commentSectionRef.current.contains(event.target as Node) &&
        commentButtonRef.current &&
        !commentButtonRef.current.contains(event.target as Node)
      ) {
        setShowComments(false);
      }
    }

    // Add the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showComments]);

  const handleVote = (voteType: "up" | "down") => {
    setPostData((prev) => {
      // If user already voted the same way, remove the vote
      if (prev.userVote === voteType) {
        return {
          ...prev,
          upvotes: voteType === "up" ? prev.upvotes - 1 : prev.upvotes,
          downvotes: voteType === "down" ? prev.downvotes - 1 : prev.downvotes,
          userVote: null,
        };
      }

      // If changing vote from up to down or vice versa
      if (prev.userVote !== null && prev.userVote !== voteType) {
        return {
          ...prev,
          upvotes: voteType === "up" ? prev.upvotes + 1 : prev.upvotes - 1,
          downvotes:
            voteType === "down" ? prev.downvotes + 1 : prev.downvotes - 1,
          userVote: voteType,
        };
      }

      // If voting for the first time
      return {
        ...prev,
        upvotes: voteType === "up" ? prev.upvotes + 1 : prev.upvotes,
        downvotes: voteType === "down" ? prev.downvotes + 1 : prev.downvotes,
        userVote: voteType,
      };
    });
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj: Comment = {
      id: Date.now().toString(),
      text: newComment,
      author: "Anonymous User", // You can replace with actual user data
      timestamp: Date.now(),
    };

    setPostData((prev) => ({
      ...prev,
      comments: [...prev.comments, newCommentObj],
    }));

    setNewComment("");
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog
    // For now, let's simulate copying to clipboard
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => alert("Link copied to clipboard!"))
      .catch(() => alert("Failed to copy link"));
  };

  // Calculate net vote count
  const voteCount = postData.upvotes - postData.downvotes;

  return (
    <div className="w-full bg-white rounded-lg p-4 mb-4 border border-gray-300 mt-2">
      <div className="flex items-center gap-2 mb-3">
        <img
          src="/subreddit-icon.png"
          alt="Subreddit icon"
          className="w-6 h-6 rounded-full"
        />
        <span className="text-blue-500">r/developersIndia</span>
        <span className="text-gray-500">• 42 min. ago</span>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        2cr PA at 30 years. Worked in FAANG companies and startups over the
        years.
      </h2>

      <p className="text-gray-700 mb-4">
        Hi Folks, sharing my journey as a software engineer, for those who might
        find it helpful. Graduated from a tier 3 college, 8 years ago. My branch
        was not CS, so didn't really study DSA or many of other core concepts
        formally. I liked web development though, so I made multiple side
        projects and worked as a freelancer on over 100 small projects in my
        college days. These projects mostly used HTML,CSS, JS, PHP and Nodejs.
        After graduating, the best offer I could expect through placements was
        that of Infosys. So I went off campus and...
      </p>

      {/* Footer section */}
      <div className="flex items-center gap-6 text-gray-500">
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleVote("up")}
            className={`p-1 rounded ${
              postData.userVote === "up" ? "text-orange-500" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3l6 6H4l6-6z" />
            </svg>
          </button>
          <span>{voteCount}</span>
          <button
            onClick={() => handleVote("down")}
            className={`p-1 rounded ${
              postData.userVote === "down" ? "text-blue-500" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 17l-6-6h12l-6 6z" />
            </svg>
          </button>
        </div>

        <button
          ref={commentButtonRef}
          className="flex items-center gap-1 hover:bg-gray-100 p-1 rounded"
          onClick={() => setShowComments(!showComments)}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
          </svg>
          <span>{postData.comments.length}</span>
        </button>

        <button
          className="flex items-center gap-1 hover:bg-gray-100 p-1 rounded"
          onClick={handleShare}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
          Share
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div ref={commentSectionRef} className="mt-4 border-t pt-4">
          <h3 className="font-medium text-lg mb-4">
            Comments ({postData.comments.length})
          </h3>

          {/* Comment form */}
          <form onSubmit={handleSubmitComment} className="mb-6">
            <textarea
              className="w-full p-3 border rounded-md resize-none mb-2"
              placeholder="What are your thoughts?"
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 disabled:opacity-50"
              disabled={!newComment.trim()}
            >
              Comment
            </button>
          </form>

          {/* Comments list */}
          <div className="space-y-4">
            {postData.comments.length === 0 ? (
              <p className="text-gray-500">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              postData.comments.map((comment) => (
                <div key={comment.id} className="border-b pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{comment.author}</span>
                    <span className="text-gray-500 text-sm">
                      {new Date(comment.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCard;
