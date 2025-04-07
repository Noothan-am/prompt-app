import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiBarChart2,
  FiUsers,
  FiMessageSquare,
  FiTrendingUp,
  FiCalendar,
  FiInfo,
  FiDownload,
  FiFilter,
  FiMoreHorizontal,
} from "react-icons/fi";
import { HiOutlineFilter } from "react-icons/hi";

// Define interfaces for our dashboard data types
interface Conversation {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  date: string;
  engagements: number;
  likes: number;
  comments: number;
  shares: number;
  hashtags: string[];
  sentiment: "positive" | "negative" | "neutral";
}

interface TopicSummary {
  name: string;
  volume: number;
  previousVolume: number;
  volumeChange: number;
  totalEngagements: number;
  previousEngagements: number;
  engagementChange: number;
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  potentialImpressions: number;
  previousImpressions: number;
  impressionsChange: number;
}

interface DashboardMetrics {
  conversations: {
    total: number;
    previousTotal: number;
    change: number;
  };
  engagements: {
    total: number;
    previousTotal: number;
    change: number;
  };
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  topEngagedAuthors: {
    name: string;
    engagements: number;
    avatar: string;
  }[];
  trendingTopics: {
    name: string;
    volume: number;
    change: number;
  }[];
}

const CommunityManagerDashboard = () => {
  // State for the dashboard data
  const [activeTab, setActiveTab] = useState<
    "performance" | "conversation" | "demographics" | "messages"
  >("performance");
  const [dateRange, setDateRange] = useState<string>("last7days");
  const [topicSummary, setTopicSummary] = useState<TopicSummary | null>(null);
  const [recentConversations, setRecentConversations] = useState<
    Conversation[]
  >([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isViewingAllConversations, setIsViewingAllConversations] =
    useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);

  // Mock data generation - replace with actual API calls in production
  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = () => {
      // Mock data for topic summary
      const mockTopicSummary: TopicSummary = {
        name: "Style",
        volume: 11000,
        previousVolume: 10000,
        volumeChange: 10,
        totalEngagements: 100829,
        previousEngagements: 97890,
        engagementChange: 3,
        sentiment: {
          positive: 67,
          negative: 13,
          neutral: 20,
        },
        potentialImpressions: 23100829,
        previousImpressions: 22300000,
        impressionsChange: 3.5,
      };

      // Mock data for recent conversations
      const mockConversations: Conversation[] = [
        {
          id: "1",
          author: "Chyntia Christine",
          authorAvatar: "https://i.pravatar.cc/150?img=1",
          content:
            "Elevate your everyday look with unique style choices! Remember, it's not just about the clothes you wear; it's about how you wear them. #Fashion #Style",
          date: "August 5, 2024 11:20 AM",
          engagements: 23340,
          likes: 18200,
          comments: 1240,
          shares: 3900,
          hashtags: ["Fashion", "Style"],
          sentiment: "positive",
        },
        {
          id: "2",
          author: "Chyntia Christine",
          authorAvatar: "https://i.pravatar.cc/150?img=1",
          content:
            "Athleisure is the perfect blend of comfort and style! Whether hitting the gym or running errands, look good while you move! #Athleisure #Style",
          date: "August 5, 2024 11:20 AM",
          engagements: 8910,
          likes: 6700,
          comments: 780,
          shares: 1430,
          hashtags: ["Athleisure", "Style"],
          sentiment: "positive",
        },
        {
          id: "3",
          author: "Chyntia Christine",
          authorAvatar: "https://i.pravatar.cc/150?img=1",
          content:
            "Finding your personal style takes time, but it's worth it! Experiment with different looks until you find what makes you feel fabulous. #Style #FashionTips",
          date: "August 5, 2024 11:20 AM",
          engagements: 6450,
          likes: 4900,
          comments: 725,
          shares: 825,
          hashtags: ["Style", "FashionTips"],
          sentiment: "positive",
        },
      ];

      // Mock metrics data
      const mockMetrics: DashboardMetrics = {
        conversations: {
          total: 10030,
          previousTotal: 9560,
          change: 4.9,
        },
        engagements: {
          total: 9.29,
          previousTotal: 8.97,
          change: 3.5,
        },
        sentiment: {
          positive: 67,
          negative: 13,
          neutral: 20,
        },
        topEngagedAuthors: [
          {
            name: "Chyntia Christine",
            engagements: 38700,
            avatar: "https://i.pravatar.cc/150?img=1",
          },
          {
            name: "Markus Winters",
            engagements: 24500,
            avatar: "https://i.pravatar.cc/150?img=2",
          },
          {
            name: "Sarah Johnson",
            engagements: 19300,
            avatar: "https://i.pravatar.cc/150?img=3",
          },
          {
            name: "Michael Lee",
            engagements: 16800,
            avatar: "https://i.pravatar.cc/150?img=4",
          },
          {
            name: "Jessica Taylor",
            engagements: 15200,
            avatar: "https://i.pravatar.cc/150?img=5",
          },
        ],
        trendingTopics: [
          { name: "Fashion", volume: 5600, change: 12 },
          { name: "Athleisure", volume: 3200, change: 8 },
          { name: "Summer Style", volume: 2800, change: 15 },
          { name: "Accessories", volume: 2100, change: 5 },
          { name: "Sustainable Fashion", volume: 1900, change: 22 },
        ],
      };

      // Generate mock chart data for conversation trend over time
      const mockChartData = {
        labels: [
          "Aug 1",
          "Aug 2",
          "Aug 3",
          "Aug 4",
          "Aug 5",
          "Aug 6",
          "Aug 7",
          "Aug 8",
        ],
        datasets: [
          {
            label: "Topic Volume",
            data: [2000, 3500, 2800, 4500, 4200, 3700, 4800, 6000],
            borderColor: "#4F46E5",
            backgroundColor: "#4F46E5",
            tension: 0.4,
            fill: false,
          },
          {
            label: "Predicted Volume",
            data: [1800, 3300, 2600, 4300, 4000, 3500, 4600, 5800],
            borderColor: "#E5E7EB",
            backgroundColor: "#E5E7EB",
            tension: 0.4,
            borderDash: [5, 5],
            fill: false,
          },
        ],
      };

      // Set all the fetched data to state
      setTopicSummary(mockTopicSummary);
      setRecentConversations(mockConversations);
      setMetrics(mockMetrics);
      setChartData(mockChartData);
    };

    fetchDashboardData();
  }, [dateRange]);

  // Handler for date range changes
  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
  };

  // Handler for topic selection
  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic === selectedTopic ? null : topic);
  };

  // Format numbers for display
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Community Manager Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor and analyze community engagement
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50">
            <FiDownload className="mr-2" />
            <span>Export</span>
          </button>
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
            value={dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
      </div>

      {/* Topic Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-gray-700 font-medium">
            Track Your Own Topics
          </span>
          <button className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md text-sm font-medium">
            + Add Topic
          </button>
        </div>
        <div className="mt-4 md:mt-0 flex items-center">
          <button className="flex items-center text-gray-700 bg-gray-100 px-3 py-1 rounded-md text-sm font-medium">
            <HiOutlineFilter className="mr-1" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px space-x-8">
          <button
            onClick={() => setActiveTab("performance")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "performance"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Performance
          </button>
          <button
            onClick={() => setActiveTab("conversation")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "conversation"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Conversation
          </button>
          <button
            onClick={() => setActiveTab("demographics")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "demographics"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Demographics
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "messages"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Messages
          </button>
        </nav>
      </div>

      {/* Dashboard Content */}
      {activeTab === "performance" && (
        <div>
          {/* Topic Summary */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Topic Summary
              </h2>
              <div className="flex items-center space-x-2 text-gray-600">
                <button className="hover:text-gray-900">
                  <FiInfo />
                </button>
                <button className="hover:text-gray-900">
                  <FiMoreHorizontal />
                </button>
              </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Volume Card */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    TOP VOLUME
                  </h3>
                  <FiInfo className="text-gray-400" />
                </div>
                <div className="mb-2">
                  <p className="text-2xl font-bold">
                    {topicSummary?.volume.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      topicSummary?.volumeChange &&
                      topicSummary.volumeChange > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {topicSummary?.volumeChange && topicSummary.volumeChange > 0
                      ? "+"
                      : ""}
                    {topicSummary?.volumeChange}% vs last month
                  </span>
                </div>
              </div>

              {/* Total Engagements Card */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    TOTAL ENGAGEMENTS
                  </h3>
                  <FiInfo className="text-gray-400" />
                </div>
                <div className="mb-2">
                  <p className="text-2xl font-bold">
                    {topicSummary?.totalEngagements.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      topicSummary?.engagementChange &&
                      topicSummary.engagementChange > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {topicSummary?.engagementChange &&
                    topicSummary.engagementChange > 0
                      ? "+"
                      : ""}
                    {topicSummary?.engagementChange}% vs last month
                  </span>
                </div>
              </div>

              {/* Avg Engagements Card */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    AVG. ENGAGEMENTS
                  </h3>
                  <FiInfo className="text-gray-400" />
                </div>
                <div className="mb-2">
                  <p className="text-2xl font-bold">9.29</p>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    +3% vs last month
                  </span>
                </div>
              </div>

              {/* Positive Sentiment Card */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    POSITIVE SENTIMENT
                  </h3>
                  <FiInfo className="text-gray-400" />
                </div>
                <div className="mb-2">
                  <p className="text-2xl font-bold">
                    {topicSummary?.sentiment.positive}%
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    +5% vs last month
                  </span>
                </div>
              </div>
            </div>

            {/* Second Row Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Potential Impressions Card */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    POTENTIAL IMPRESSIONS
                  </h3>
                  <FiInfo className="text-gray-400" />
                </div>
                <div className="mb-2">
                  <p className="text-2xl font-bold">
                    {topicSummary?.potentialImpressions.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    +3% vs last month
                  </span>
                </div>
              </div>

              {/* Positive Sentiment Card */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    POSITIVE SENTIMENT
                  </h3>
                  <FiInfo className="text-gray-400" />
                </div>
                <div className="mb-2">
                  <p className="text-2xl font-bold">
                    {topicSummary?.sentiment.positive}%
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    +5% vs last month
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Conversation Trend Over Time */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Conversation Trend Over Time
              </h2>
              <div className="flex items-center space-x-2 text-gray-600">
                <button className="hover:text-gray-900">
                  <FiInfo />
                </button>
                <button className="hover:text-gray-900">
                  <FiMoreHorizontal />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <div>
                <select className="border border-gray-300 rounded-md px-3 py-1.5 bg-white text-sm">
                  <option value="volume">Volume</option>
                  <option value="engagement">Engagement</option>
                  <option value="sentiment">Sentiment</option>
                </select>
              </div>
              <div>
                <select className="border border-gray-300 rounded-md px-3 py-1.5 bg-white text-sm">
                  <option value="total">Total</option>
                  <option value="average">Average</option>
                </select>
              </div>
              <div className="ml-auto">
                <select className="border border-gray-300 rounded-md px-3 py-1.5 bg-white text-sm">
                  <option value="byDay">by day</option>
                  <option value="byWeek">by week</option>
                  <option value="byMonth">by month</option>
                </select>
              </div>
            </div>

            {/* Chart Placeholder - In a real app, you would use a chart library like Chart.js, Recharts, etc. */}
            <div className="w-full h-64 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">
                Trend chart would be rendered here
              </p>
            </div>
          </div>

          {/* Audience Reach */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Audience Reach
              </h2>
              <div className="flex items-center space-x-2 text-gray-600">
                <button className="hover:text-gray-900">
                  <FiMoreHorizontal />
                </button>
              </div>
            </div>

            {/* Audience Metrics - Placeholder */}
            <div className="w-full h-48 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">
                Audience metrics would be displayed here
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Conversations Tab Content */}
      {activeTab === "conversation" && (
        <div>
          {/* Conversations Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Conversations : August 5, 2024
            </h2>
            <div className="mt-2 md:mt-0">
              <select className="border border-gray-300 rounded-md px-3 py-1.5 bg-white text-sm">
                <option value="allConversation">All Conversation</option>
                <option value="topEngaged">Top Engaged</option>
                <option value="mostRecent">Most Recent</option>
              </select>
            </div>
          </div>

          {/* Conversation Metrics */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Conversations</div>
              <div className="text-2xl font-bold">10,030</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Totals</div>
              <div className="text-2xl font-bold">10,030</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Share of Topic</div>
              <div className="text-2xl font-bold">76.8%</div>
            </div>
          </div>

          {/* Recent Conversations */}
          <div className="space-y-4">
            {recentConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="bg-white rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={conversation.authorAvatar}
                      alt={conversation.author}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium">{conversation.author}</h3>
                      <p className="text-sm text-gray-500">
                        @{conversation.author.replace(" ", "").toLowerCase()}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {conversation.date}
                  </div>
                </div>
                <p className="mb-4">{conversation.content}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <div className="flex space-x-4">
                    <span>High Engagement</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>
                      {formatNumber(conversation.engagements)} Engagements
                    </span>
                    <button>
                      <FiMoreHorizontal />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Demographics Tab Content */}
      {activeTab === "demographics" && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Demographics Analysis
          </h2>
          <div className="text-center py-12">
            <p className="text-gray-500">
              Demographics data would be displayed here
            </p>
          </div>
        </div>
      )}

      {/* Messages Tab Content */}
      {activeTab === "messages" && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Message Analysis
          </h2>
          <div className="text-center py-12">
            <p className="text-gray-500">
              Message analysis data would be displayed here
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityManagerDashboard;
