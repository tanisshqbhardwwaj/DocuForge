import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (!user.org_setup_complete) {
        navigate("/setup");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <i className="fas fa-file-invoice"></i>
          <span>DocuForge</span>
        </div>
        <div className="auth-hero">
          <h1>
            Professional documents,
            <br />
            <span className="gradient-text">generated instantly.</span>
          </h1>
          <p>
            Create invoices, purchase orders, and more with real-time preview
            and one-click PDF export.
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="feature-icon">
                <i className="fas fa-bolt"></i>
              </div>
              <div>
                <strong>Lightning Fast</strong>
                <span>Generate documents in seconds</span>
              </div>
            </div>
            <div className="auth-feature">
              <div className="feature-icon">
                <i className="fas fa-eye"></i>
              </div>
              <div>
                <strong>Real-time Editing</strong>
                <span>See changes as you type</span>
              </div>
            </div>
            <div className="auth-feature">
              <div className="feature-icon">
                <i className="fas fa-database"></i>
              </div>
              <div>
                <strong>Auto-saved</strong>
                <span>Your details, always remembered</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <h2>Welcome back</h2>
          <p className="auth-subtitle">Sign in to your DocuForge account</p>

          {error && (
            <div className="auth-error" id="login-error">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" id="login-form">
            <div className="auth-field">
              <label htmlFor="login-email">
                <i className="fas fa-envelope"></i> Email address
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
              />
            </div>
            <div className="auth-field">
              <label htmlFor="login-password">
                <i className="fas fa-lock"></i> Password
              </label>
              <input
                id="login-password"
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="btn btn-auth"
              disabled={loading}
              id="btn-login"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account? <Link to="/signup">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
