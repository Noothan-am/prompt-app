import React, { useState, useEffect, useRef } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: number;
  replies: Comment[];
}

interface PostData {
  id: string;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  userVote?: "up" | "down" | null;
}

interface PostCardProps {
  title?: string;
  content?: string;
  files?: File[];
  timestamp?: number;
}

function PostCard({
  title: propTitle,
  content: propContent,
  files: propFiles,
  timestamp: propTimestamp,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
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

  // Create URLs for image files
  useEffect(() => {
    if (propFiles && propFiles.length > 0) {
      const urls = propFiles.map((file) => URL.createObjectURL(file));
      setImageUrls(urls);
      return () => {
        // Cleanup URLs when component unmounts
        urls.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [propFiles]);

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

  const handleSubmitComment = (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj: Comment = {
      id: Date.now().toString(),
      text: newComment,
      author: "Anonymous User", // You can replace with actual user data
      timestamp: Date.now(),
      replies: [],
    };

    setPostData((prev) => {
      if (parentId) {
        // Add reply to existing comment
        const addReplyToComment = (comments: Comment[]): Comment[] => {
          return comments.map((comment) => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...comment.replies, newCommentObj],
              };
            }
            return {
              ...comment,
              replies: addReplyToComment(comment.replies),
            };
          });
        };
        return {
          ...prev,
          comments: addReplyToComment(prev.comments),
        };
      } else {
        return {
          ...prev,
          comments: [...prev.comments, newCommentObj],
        };
      }
    });

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

  const handleReplyClick = (commentId: string) => {
    setReplyingTo(commentId);
    setReplyText("");
  };

  const handleSubmitReply = (
    e: React.FormEvent,
    parentId: string,
    replyContent: string
  ) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    const newCommentObj: Comment = {
      id: Date.now().toString(),
      text: replyContent,
      author: "Anonymous User",
      timestamp: Date.now(),
      replies: [],
    };

    setPostData((prev) => {
      const addReplyToComment = (comments: Comment[]): Comment[] => {
        return comments.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...comment.replies, newCommentObj],
            };
          }
          // Recursively search in replies
          if (comment.replies.length > 0) {
            return {
              ...comment,
              replies: addReplyToComment(comment.replies),
            };
          }
          return comment;
        });
      };

      return {
        ...prev,
        comments: addReplyToComment(prev.comments),
      };
    });

    setReplyingTo(null);
  };

  // Calculate net vote count
  const voteCount = postData.upvotes - postData.downvotes;

  // Calculate total number of comments including replies
  const getTotalCommentCount = (comments: Comment[]): number => {
    return comments.reduce((total, comment) => {
      // Add 1 for the current comment and recursively count replies
      return total + 1 + getTotalCommentCount(comment.replies);
    }, 0);
  };

  const title =
    propTitle ||
    "2cr PA at 30 years. Worked in FAANG companies and startups over the years.";
  const content =
    propContent ||
    `Hi Folks, sharing my journey as a software engineer, for those who might
    find it helpful. Graduated from a tier 3 college, 8 years ago. My branch
    was not CS, so didn't really study DSA or many of other core concepts
    formally. I liked web development though, so I made multiple side
    projects and worked as a freelancer on over 100 small projects in my
    college days. These projects mostly used HTML,CSS, JS, PHP and Nodejs.
    After graduating, the best offer I could expect through placements was
    that of Infosys. So I went off campus and...`;
  const timestamp = propTimestamp || Date.now();

  const shouldTruncate = content.length > 450;
  const truncatedText = shouldTruncate
    ? content.slice(0, 450) + "..."
    : content;

  const isImageFile = (file: File) => file.type.startsWith("image/");
  const isVideoFile = (file: File) => file.type.startsWith("video/");
  const isDocumentFile = (file: File) => file.type.startsWith("application/");

  const handlePreviousFile = () => {
    setCurrentFileIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNextFile = () => {
    setCurrentFileIndex((prevIndex) =>
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Get the current file extension
  const getFileExtension = (url: string) => {
    const filename = url.split("/").pop() || "";
    return filename.split(".").pop()?.toLowerCase() || "";
  };

  const RecursiveComment = ({
    comment,
    depth = 0,
  }: {
    comment: Comment;
    depth?: number;
  }) => {
    const [localReplyText, setLocalReplyText] = useState("");

    const handleReplyButtonClick = (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent default behavior
      e.stopPropagation(); // Prevent event bubbling
      handleReplyClick(comment.id);
    };

    const handleCancelReply = () => {
      setReplyingTo(null);
      setLocalReplyText("");
    };

    return (
      <div
        className={`${
          depth > 0 ? "ml-8 border-l-2 border-gray-200 pl-4" : "border-b"
        } pb-3`}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium">{comment.author}</span>
          <span className="text-gray-500 text-sm">
            {new Date(comment.timestamp).toLocaleString()}
          </span>
        </div>
        <p className="text-gray-700">{comment.text}</p>

        <div className="flex items-center gap-4 mt-2">
          {/* Reply button */}
          <button
            onClick={handleReplyButtonClick}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            Reply
          </button>
        </div>

        {/* Reply form */}
        {replyingTo === comment.id && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!localReplyText.trim()) return;
              handleSubmitReply(e, comment.id, localReplyText);
              setLocalReplyText("");
            }}
            className="mt-4"
          >
            <textarea
              className="w-full p-3 border rounded-md resize-none mb-2"
              placeholder={`Reply to ${comment.author}...`}
              rows={2}
              value={localReplyText}
              onChange={(e) => setLocalReplyText(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 disabled:opacity-50"
                disabled={!localReplyText.trim()}
              >
                Reply
              </button>
              <button
                type="button"
                onClick={handleCancelReply}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Replies are always visible */}
        <div className="mt-4 space-y-4">
          {comment.replies.length > 0 &&
            comment.replies.map((reply) => (
              <RecursiveComment
                key={reply.id}
                comment={reply}
                depth={depth + 1}
              />
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-white rounded-lg p-4 mb-4 border border-gray-300 mt-2">
      <div className="flex items-center gap-2 mb-3">
        <img
          src="/subreddit-icon.png"
          alt="Subreddit icon"
          className="w-6 h-6 rounded-full"
        />
        <span className="text-blue-500">r/developersIndia</span>
        <span className="text-gray-500">
          • {new Date(timestamp).toLocaleString()}
        </span>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-3">{title}</h2>

      <div className="text-gray-700 mb-4">
        <p>{showFullText ? content : truncatedText}</p>
        {shouldTruncate && (
          <button
            onClick={() => setShowFullText(!showFullText)}
            className="text-blue-500 hover:text-blue-600 font-medium mt-2"
          >
            {showFullText ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      {propFiles && propFiles.length > 0 && (
        <div className="relative mb-4 rounded-lg overflow-hidden">
          {/* File counter */}
          {propFiles.length > 1 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-md text-sm z-10">
              {currentFileIndex + 1}/{propFiles.length}
            </div>
          )}

          {/* Current file display */}
          <div className="relative">
            {propFiles &&
              (() => {
                const currentFile = propFiles[currentFileIndex];
                if (isImageFile(currentFile)) {
                  return (
                    <img
                      src={imageUrls[currentFileIndex]}
                      alt={`Attachment ${currentFileIndex + 1}`}
                      className="w-full h-auto max-h-[500px] object-contain"
                    />
                  );
                } else if (isVideoFile(currentFile)) {
                  return (
                    <video
                      src={imageUrls[currentFileIndex]}
                      controls
                      className="w-full h-auto max-h-[500px]"
                    >
                      Your browser doesn't support video playback.
                    </video>
                  );
                } else if (isDocumentFile(currentFile)) {
                  const fileExtension = getFileExtension(
                    imageUrls[currentFileIndex]
                  );
                  return (
                    <div className="bg-gray-100 p-4 rounded-lg text-center">
                      <div className="text-4xl mb-2">📄</div>
                      <p className="font-medium">{currentFile.name}</p>
                      <p className="text-gray-500 text-sm">
                        {fileExtension.toUpperCase()} Document •{" "}
                        {(currentFile.size / 1024).toFixed(1)} KB
                      </p>
                      <a
                        href={imageUrls[currentFileIndex]}
                        download={currentFile.name}
                        className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded-md"
                      >
                        Download
                      </a>
                    </div>
                  );
                } else {
                  return (
                    <div className="bg-gray-100 p-4 rounded-lg text-center">
                      <div className="text-4xl mb-2">🗂️</div>
                      <p className="font-medium">{currentFile.name}</p>
                      <p className="text-gray-500 text-sm">
                        Unknown file type •{" "}
                        {(currentFile.size / 1024).toFixed(1)} KB
                      </p>
                      <a
                        href={imageUrls[currentFileIndex]}
                        download={currentFile.name}
                        className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded-md"
                      >
                        Download
                      </a>
                    </div>
                  );
                }
              })()}

            {/* Navigation Controls */}
            {propFiles.length > 1 && (
              <>
                <button
                  onClick={handlePreviousFile}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-r-md hover:bg-opacity-70"
                >
                  <IoChevronBackOutline className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextFile}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-l-md hover:bg-opacity-70"
                >
                  <IoChevronForwardOutline className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail navigation for multiple files */}
          {propFiles.length > 1 && (
            <div className="flex overflow-x-auto mt-2 space-x-2 p-1">
              {propFiles.map((file, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentFileIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 cursor-pointer rounded-md overflow-hidden border-2 ${
                    index === currentFileIndex
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                >
                  {isImageFile(file) ? (
                    <img
                      src={imageUrls[index]}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : isVideoFile(file) ? (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      🎬
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      📄
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
          <span>{getTotalCommentCount(postData.comments)}</span>
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
            Comments ({getTotalCommentCount(postData.comments)})
          </h3>

          {/* Comment form */}
          <form onSubmit={(e) => handleSubmitComment(e)} className="mb-6">
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
                <RecursiveComment key={comment.id} comment={comment} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCard;
