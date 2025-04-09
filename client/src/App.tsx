import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import CommunitiesPage from "./pages/CommunitiesPage";
import RedditStyleCommunityPage from "./pages/RedditStyleCommunityPage";
import UserProfile from "./pages/UserProfile";
import EditProfilePage from "./pages/EditProfilePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserSetupPage from "./pages/UserSetupPage";
import NotificationDemo from "./pages/NotificationDemo";
import AllNotificationsPage from "./pages/AllNotificationsPage";
import CommunityManagerDashboard from "./pages/CommunityManagerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { NotificationProvider } from "./context/NotificationContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            {/* Public routes without navbar/sidebar */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected route but doesn't require completed profile */}
            <Route
              path="/user-setup"
              element={
                <ProtectedRoute requireSetup={false}>
                  <UserSetupPage />
                </ProtectedRoute>
              }
            />

            {/* Protected routes with navbar/sidebar */}
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-white flex flex-col">
                    <Navbar toggleSidebar={toggleSidebar} />
                    <div className="flex flex-1 pt-[3.5rem] md:pt-[4rem]">
                      <Sidebar
                        isOpen={isSidebarOpen}
                        toggleSidebar={toggleSidebar}
                      />
                      <main className="flex-1 overflow-y-auto bg-gray-50">
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/prompts" element={<Dashboard />} />
                          <Route
                            path="/communities"
                            element={<CommunitiesPage />}
                          />
                          <Route
                            path="/community/:id"
                            element={<RedditStyleCommunityPage />}
                          />
                          <Route path="/profile" element={<UserProfile />} />
                          <Route
                            path="/profile/:username"
                            element={<UserProfile />}
                          />
                          <Route
                            path="/edit-profile"
                            element={<EditProfilePage />}
                          />
                          <Route
                            path="/notifications-demo"
                            element={<NotificationDemo />}
                          />
                          <Route
                            path="/notifications"
                            element={<AllNotificationsPage />}
                          />
                          <Route
                            path="/community-manager"
                            element={<CommunityManagerDashboard />}
                          />
                        </Routes>
                      </main>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
