import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requireSetup?: boolean;
}

const ProtectedRoute = ({
  children,
  requireSetup = true,
}: ProtectedRouteProps) => {
  const { currentUser, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  // If still loading auth state, show nothing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but profile not set up, redirect to user setup
  if (requireSetup && currentUser && !currentUser.profileSetupComplete) {
    return <Navigate to="/user-setup" state={{ from: location }} replace />;
  }

  // Render children if all conditions pass
  return <>{children}</>;
};

export default ProtectedRoute;
