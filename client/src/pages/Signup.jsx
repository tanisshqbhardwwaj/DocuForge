import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    company_name: '', email: '', phone: '', password: '', agree: false
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Basic Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address');
      return;
    }

    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    if (form.phone && !phoneRegex.test(form.phone)) {
      setError('Please enter a valid phone number (digits only)');
      return;
    }

    if (!form.agree) {
      setError('Please agree to the Terms of Service')
      return
    }

    setLoading(true)
    try {
      await signup(form.company_name, form.email, form.phone, form.password)
      navigate('/setup')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <i className="fas fa-file-invoice"></i>
          <span>DocuForge</span>
        </div>
        <div className="auth-hero">
          <h1>End-to-end billing<br />solution for <span className="gradient-text">growing businesses.</span></h1>
          <p>Join thousands of businesses creating professional invoices and purchase orders effortlessly.</p>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="feature-icon"><i className="fas fa-file-invoice-dollar"></i></div>
              <div>
                <strong>Simplify your billing</strong>
                <span>Create documents in clicks</span>
              </div>
            </div>
            <div className="auth-feature">
              <div className="feature-icon"><i className="fas fa-credit-card"></i></div>
              <div>
                <strong>Streamline your process</strong>
                <span>Auto-fill from your profile</span>
              </div>
            </div>
            <div className="auth-feature">
              <div className="feature-icon"><i className="fas fa-chart-line"></i></div>
              <div>
                <strong>Grow your business</strong>
                <span>Track all document history</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <h2>Let's get started</h2>
          <p className="auth-subtitle">Create your free DocuForge account</p>

          {error && (
            <div className="auth-error" id="signup-error">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" id="signup-form">
            <div className="auth-field">
              <label htmlFor="signup-company"><i className="fas fa-building"></i> Company Name</label>
              <input id="signup-company" type="text" required
                value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })}
                placeholder="Your Company Name" />
            </div>
            <div className="auth-field">
              <label htmlFor="signup-email"><i className="fas fa-envelope"></i> Email address</label>
              <input id="signup-email" type="email" required
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com" />
            </div>
            <div className="auth-field">
              <label htmlFor="signup-phone"><i className="fas fa-phone"></i> Phone number</label>
              <input id="signup-phone" type="tel"
                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210" />
            </div>
            <div className="auth-field">
              <label htmlFor="signup-password"><i className="fas fa-lock"></i> Password</label>
              <input id="signup-password" type="password" required minLength={6}
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Min 6 characters" />
            </div>

            <label className="auth-checkbox">
              <input type="checkbox" checked={form.agree}
                onChange={e => setForm({ ...form, agree: e.target.checked })} id="signup-agree" />
              <span>I agree to the <a href="#" onClick={e => e.preventDefault()}>Terms of Service</a> and <a href="#" onClick={e => e.preventDefault()}>Privacy Policy</a></span>
            </label>

            <button type="submit" className="btn btn-auth" disabled={loading} id="btn-signup">
              {loading ? <><i className="fas fa-spinner fa-spin"></i> Creating account...</> : 'Create your account'}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
