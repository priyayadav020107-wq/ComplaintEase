import { useState } from "react";
import { useAuth } from "../context/AuthContext";

// Same page/shape for both roles: edit name, email and (optionally) password.
export default function ProfileSettings() {
  const { user, updateProfile, loading } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const updates = { name, email };
    if (password) updates.password = password;

    const result = await updateProfile(updates);
    if (result.success) {
      setSuccess("Profile updated successfully");
      setPassword("");
      setConfirmPassword("");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="page page-wide">
      <div className="page-header">
        <h2>Profile &amp; Settings</h2>
      </div>

      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}

      <form className="auth-form profile-form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Leave blank to keep current password"
          minLength={6}
        />

        <label>Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Leave blank to keep current password"
          minLength={6}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
