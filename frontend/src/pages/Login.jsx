import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
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
          <h1>Welcome Back</h1>
          <p>
            Sign in to file new complaints, track their status, and stay
            updated every step of the way.
          </p>
        </div>
      </div>
      <div className="split-auth-form-side">
        <form className="auth-form split-auth-form" onSubmit={handleSubmit}>
          <h2>User Login</h2>
          {error && <p className="error-text">{error}</p>}
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </form>
      </div>
    </div>
  );
}
