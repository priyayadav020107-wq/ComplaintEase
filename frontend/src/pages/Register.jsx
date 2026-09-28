import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await register(name, email, password);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="split-auth-page">
      <div className="split-auth-visual">
        <div className="split-auth-visual-inner">
          <span className="split-auth-brand">ComplaintEase</span>
          <h1>Join ComplaintEase</h1>
          <p>
            Create an account to start filing complaints and tracking
            their resolution in real time.
          </p>
        </div>
      </div>
      <div className="split-auth-form-side">
        <form className="auth-form split-auth-form" onSubmit={handleSubmit}>
          <h2>Create an account</h2>
          {error && <p className="error-text">{error}</p>}
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          <button type="submit" disabled={loading}>{loading ? "Creating..." : "Register"}</button>
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </form>
      </div>
    </div>
  );
}
