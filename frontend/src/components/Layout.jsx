import { useState, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import NewComplaintModal from "./NewComplaintModal";
import { useAuth } from "../context/AuthContext";

// Shell for every logged-in page: sidebar on the left, the page itself
// on the right, plus the "+ New Complaint" button/modal shown above
// every user-side page except Profile & Settings.
export default function Layout() {
  const { user } = useAuth();
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const showNewComplaintButton = user?.role !== "admin" && location.pathname !== "/profile";

  const handleCreated = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        {showNewComplaintButton && (
          <div className="page-toolbar">
            <button type="button" className="btn-link" onClick={() => setModalOpen(true)}>
              + New Complaint
            </button>
          </div>
        )}
        <Outlet context={{ refreshKey, triggerRefresh: handleCreated }} />
      </main>

      <NewComplaintModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
