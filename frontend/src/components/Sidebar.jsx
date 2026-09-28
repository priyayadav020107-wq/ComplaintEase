import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Left-hand navigation. Links stay the same for both roles, only the
// label/target for the complaints link changes between user and admin.
export default function Sidebar() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const linkClass = ({ isActive }) => `sidebar-link${isActive ? " active" : ""}`;

  return (
    <aside className="sidebar">
      <nav className="sidebar-links">
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/complaints" className={linkClass}>
          {isAdmin ? "All Complaints" : "My Complaints"}
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          Profile &amp; Settings
        </NavLink>
      </nav>
    </aside>
  );
}
