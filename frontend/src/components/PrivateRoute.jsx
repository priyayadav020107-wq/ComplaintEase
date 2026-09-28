import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wraps a route element. Redirects to /login if nobody is logged in.
// If adminOnly is set, non-admin users are redirected to the dashboard.
export default function PrivateRoute({ children, adminOnly = false }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
