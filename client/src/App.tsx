import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="fixed inset-0 pt-20">
          <div className="flex h-full relative">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <main className="flex-1 overflow-y-auto bg-gray-50 w-full">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<HomePage />} />
                {/* Add more routes as needed */}
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
