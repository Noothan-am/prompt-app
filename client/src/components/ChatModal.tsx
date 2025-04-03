import React, { useState, useEffect, useRef } from "react";
import { IoClose, IoSend } from "react-icons/io5";
import { AiFillPushpin } from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs";
import { FaCamera } from "react-icons/fa";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  isCurrentUser: boolean;
}

interface ChatGroup {
  id: string;
  name: string;
  lastMessage: string;
  lastActivity: number;
  unread: boolean;
  isPinned?: boolean;
  subreddit?: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat groups and messages from localStorage on mount
  useEffect(() => {
    const savedChatGroups = localStorage.getItem("chatGroups");
    if (savedChatGroups) {
      setChatGroups(JSON.parse(savedChatGroups));
    } else {
      // Initial sample data
      const initialChatGroups: ChatGroup[] = [
        {
          id: "general-chat",
          name: "General-chat",
          subreddit: "r/IndiaTech",
          lastMessage: "Nord for better specs and decent camera.",
          lastActivity: Date.now() - 1000 * 60 * 5, // 5 minutes ago
          unread: false,
          isPinned: true,
        },
        {
          id: "automation",
          name: "AutomationLikeCrazy",
          lastMessage: "You: i have not started yet",
          lastActivity: Date.now() - 1000 * 60 * 60 * 24 * 7, // 7 days ago
          unread: false,
        },
        {
          id: "sarahbishop",
          name: "Sarahbishopmaker",
          lastMessage: "You: no i was just checking",
          lastActivity: Date.now() - 1000 * 60 * 60 * 24 * 8, // 8 days ago
          unread: false,
        },
        {
          id: "raz-8",
          name: "Raz--8",
          lastMessage: "Raz--8: https://discord.co...",
          lastActivity: Date.now() - 1000 * 60 * 60 * 24 * 35, // 35 days ago
          unread: false,
        },
      ];
      setChatGroups(initialChatGroups);
      localStorage.setItem("chatGroups", JSON.stringify(initialChatGroups));
    }
  }, []);

  // Load messages for active chat
  useEffect(() => {
    if (activeChat) {
      const savedMessages = localStorage.getItem(`messages-${activeChat}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else if (activeChat === "general-chat") {
        // Sample initial messages for general chat
        const initialMessages: Message[] = [
          {
            id: "1",
            sender: "System",
            content:
              "Chat Rules 1. Please be civil. All the sub rules are a...",
            timestamp: Date.now() - 1000 * 60 * 60 * 2,
            isCurrentUser: false,
          },
          {
            id: "2",
            sender: "Anonymous123",
            content: "Yo",
            timestamp: Date.now() - 1000 * 60 * 60,
            isCurrentUser: false,
          },
          {
            id: "3",
            sender: "CoolUser456",
            content: "Ssup",
            timestamp: Date.now() - 1000 * 60 * 55,
            isCurrentUser: false,
          },
          {
            id: "4",
            sender: "Innocent_Guy3",
            content: "Hey",
            timestamp: Date.now() - 1000 * 60 * 45,
            isCurrentUser: false,
          },
          {
            id: "5",
            sender: "Suspicious-Life-8704",
            content: "Yoo",
            timestamp: Date.now() - 1000 * 60 * 30,
            isCurrentUser: false,
          },
          {
            id: "6",
            sender: "mugiwara_no_luffy06",
            content:
              "35k ke niche best camera phone kya hoga? With good battery and processor. But main focus is camera",
            timestamp: Date.now() - 1000 * 60 * 20,
            isCurrentUser: false,
          },
          {
            id: "7",
            sender: "System",
            content: "1 reply",
            timestamp: Date.now() - 1000 * 60 * 18,
            isCurrentUser: false,
          },
          {
            id: "8",
            sender: "Adventurous_Knee2859",
            content:
              "Nord for better specs and decent camera.\n\nPixel for better camera but average specs",
            timestamp: Date.now() - 1000 * 60 * 5,
            isCurrentUser: false,
          },
        ];
        setMessages(initialMessages);
        localStorage.setItem(
          `messages-${activeChat}`,
          JSON.stringify(initialMessages)
        );
      } else {
        setMessages([]);
      }
    }
  }, [activeChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !activeChat) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "You",
      content: newMessage,
      timestamp: Date.now(),
      isCurrentUser: true,
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    localStorage.setItem(
      `messages-${activeChat}`,
      JSON.stringify(updatedMessages)
    );

    // Update the chat group's last message
    const updatedChatGroups = chatGroups.map((group) => {
      if (group.id === activeChat) {
        return {
          ...group,
          lastMessage: `You: ${
            newMessage.length > 20
              ? newMessage.substring(0, 20) + "..."
              : newMessage
          }`,
          lastActivity: Date.now(),
        };
      }
      return group;
    });
    setChatGroups(updatedChatGroups);
    localStorage.setItem("chatGroups", JSON.stringify(updatedChatGroups));

    setNewMessage("");
  };

  // Format timestamp
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${
      hours >= 12 ? "PM" : "AM"
    }`;
  };

  // Format date for chat list (today, yesterday, or date)
  const formatDate = (timestamp: number): string => {
    const now = new Date();
    const date = new Date(timestamp);

    if (now.toDateString() === date.toDateString()) {
      return "Today";
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (yesterday.toDateString() === date.toDateString()) {
      return "Yesterday";
    }

    // If in the last week, return day name
    const daysAgo = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysAgo < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    }

    // Otherwise return month and day
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-end z-50 pointer-events-none">
      <div className="w-full md:w-[500px] lg:w-[550px] h-[80vh] my-auto flex flex-col bg-white text-gray-800 shadow-lg border border-gray-200 rounded-l-lg pointer-events-auto">
        {/* Chat Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Chats</h2>
          <div className="flex space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700">
              {/* Additional chat controls can go here */}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <IoClose className="w-6 h-6" />
            </button>
          </div>
        </div>

        {activeChat ? (
          <>
            {/* Active Chat Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-100">
              <div className="flex items-center">
                <button
                  onClick={() => setActiveChat(null)}
                  className="mr-3 text-gray-500 hover:text-gray-700"
                >
                  <IoClose className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-medium">
                  {chatGroups.find((g) => g.id === activeChat)?.name || "Chat"}
                </h3>
              </div>
              <div className="flex space-x-2">
                {/* Chat specific controls */}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {activeChat === "general-chat" && (
                <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AiFillPushpin className="mr-2 text-red-500" />
                    <span className="text-red-500 font-medium">Chat Rules</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    1. Please be civil. All the sub rules are a...
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 ${
                    message.isCurrentUser ? "text-right" : ""
                  }`}
                >
                  <div className="inline-block max-w-[80%]">
                    {!message.isCurrentUser && message.sender !== "System" && (
                      <div className="flex items-center mb-1">
                        <div className="w-6 h-6 rounded-full bg-gray-300 mr-2"></div>
                        <span className="text-sm font-medium">
                          {message.sender}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-lg ${
                        message.isCurrentUser
                          ? "bg-blue-500 text-white"
                          : message.sender === "System"
                          ? "bg-transparent text-gray-500 text-sm"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.content}</p>
                    </div>
                    {message.isCurrentUser && (
                      <span className="text-xs text-gray-500 mt-1 block">
                        {formatTime(message.timestamp)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Form */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-200 bg-gray-100"
            >
              <div className="flex items-center">
                <div className="flex space-x-2 mr-2">
                  <button
                    type="button"
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <FaCamera className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <BsEmojiSmile className="w-5 h-5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Message"
                  className="flex-1 p-2 rounded-md bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className={`ml-2 p-2 rounded-full ${
                    newMessage.trim()
                      ? "text-blue-500 hover:bg-gray-200"
                      : "text-gray-400"
                  }`}
                >
                  <IoSend className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            {/* Chat List */}
            <div className="flex items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium">Threads</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              {chatGroups
                .sort((a, b) => {
                  // Pinned items first, then by last activity
                  if (a.isPinned && !b.isPinned) return -1;
                  if (!a.isPinned && b.isPinned) return 1;
                  return b.lastActivity - a.lastActivity;
                })
                .map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setActiveChat(chat.id)}
                    className="p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                  >
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-gray-800 truncate">
                            {chat.name}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {formatDate(chat.lastActivity)}
                          </span>
                        </div>
                        {chat.subreddit && (
                          <p className="text-sm text-gray-500 mb-1">
                            {chat.subreddit}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 truncate">
                          {chat.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatModal;
