import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EditProfile from "../components/EditProfile";

const EditProfilePage = () => {
  const navigate = useNavigate();

  // Handle close/cancel action
  const handleClose = () => {
    navigate("/profile"); // Navigate back to profile page
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <EditProfile onClose={handleClose} />
      </div>
    </div>
  );
};

export default EditProfilePage;
