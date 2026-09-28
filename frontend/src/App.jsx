import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyComplaints from "./pages/MyComplaints";
import AllComplaints from "./pages/AllComplaints";
import ProfileSettings from "./pages/ProfileSettings";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/complaints"
            element={user?.role === "admin" ? <AllComplaints /> : <MyComplaints />}
          />
          <Route path="/profile" element={<ProfileSettings />} />
        </Route>

        <Route path="*" element={<h2 className="page">404 - Page not found</h2>} />
      </Routes>
    </>
  );
}
