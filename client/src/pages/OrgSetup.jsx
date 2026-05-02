import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function OrgSetup() {
  const { user, saveOrganization } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    org_name: user?.company_name || '',
    org_location: 'India',
    org_state: '',
    org_currency: 'INR - Indian Rupee',
    org_fiscal_year: 'April - March',
    org_language: 'English',
    org_timezone: '(GMT 5:30) India Standard Time',
    org_gst_registered: false,
    org_gstin: '',
    org_address: '',
    org_phone: user?.phone || '',
    org_email: user?.email || '',
  })

  const states = [
    'Select', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
    'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await saveOrganization(form)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => navigate('/')

  return (
    <div className="setup-page">
      <div className="setup-container">
        <div className="setup-left">
          {/* Progress bar */}
          <div className="setup-progress">
            <div className="progress-step done">
              <div className="step-dot"><i className="fas fa-check"></i></div>
              <span>Account Created</span>
            </div>
            <div className="progress-line active"></div>
            <div className="progress-step active">
              <div className="step-dot">2</div>
              <span>Organization</span>
            </div>
            <div className="progress-line"></div>
            <div className="progress-step">
              <div className="step-dot">3</div>
              <span>Ready!</span>
            </div>
          </div>

          <div className="setup-welcome">
            Welcome aboard, <strong>{user?.company_name || user?.email}!</strong>
          </div>
          <h1 className="setup-title">Tell us about your organization</h1>
          <p className="setup-subtitle">This info will auto-fill your invoices so you never type it again.</p>

          {error && (
            <div className="auth-error"><i className="fas fa-exclamation-circle"></i> {error}</div>
          )}

          <form onSubmit={handleSubmit} className="setup-form" id="org-setup-form">
            <div className="setup-field">
              <label htmlFor="org-name">Organization Name *</label>
              <input id="org-name" type="text" required
                value={form.org_name} onChange={e => setForm({ ...form, org_name: e.target.value })}
                placeholder="Your Business Name" />
            </div>

            <div className="setup-row">
              <div className="setup-field">
                <label htmlFor="org-location">Organization Location *</label>
                <select id="org-location" value={form.org_location}
                  onChange={e => setForm({ ...form, org_location: e.target.value })}>
                  <option>India</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                  <option>Australia</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="setup-field">
                <label htmlFor="org-state">State / Union Territory *</label>
                <select id="org-state" value={form.org_state}
                  onChange={e => setForm({ ...form, org_state: e.target.value })}>
                  {states.map(s => <option key={s} value={s === 'Select' ? '' : s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="setup-field">
              <label htmlFor="org-currency">Base Currency *</label>
              <select id="org-currency" value={form.org_currency}
                onChange={e => setForm({ ...form, org_currency: e.target.value })}>
                <option>INR - Indian Rupee</option>
                <option>USD - US Dollar</option>
                <option>EUR - Euro</option>
                <option>GBP - British Pound</option>
              </select>
              <span className="field-hint">The base currency cannot be changed later.</span>
            </div>

            <div className="setup-row three-col">
              <div className="setup-field">
                <label>Fiscal Year *</label>
                <select value={form.org_fiscal_year}
                  onChange={e => setForm({ ...form, org_fiscal_year: e.target.value })}>
                  <option>April - March</option>
                  <option>January - December</option>
                </select>
              </div>
              <div className="setup-field">
                <label>Language *</label>
                <select value={form.org_language}
                  onChange={e => setForm({ ...form, org_language: e.target.value })}>
                  <option>English</option>
                  <option>Hindi</option>
                </select>
              </div>
              <div className="setup-field">
                <label>Time Zone *</label>
                <select value={form.org_timezone}
                  onChange={e => setForm({ ...form, org_timezone: e.target.value })}>
                  <option>(GMT 5:30) India Standard Time</option>
                  <option>(GMT -5:00) Eastern Time</option>
                  <option>(GMT 0:00) UTC</option>
                </select>
              </div>
            </div>

            <div className="setup-field">
              <label htmlFor="org-address">Business Address</label>
              <textarea id="org-address" rows="2"
                value={form.org_address} onChange={e => setForm({ ...form, org_address: e.target.value })}
                placeholder="Full business address" />
            </div>

            <div className="setup-row">
              <div className="setup-field">
                <label htmlFor="org-phone">Business Phone</label>
                <input id="org-phone" type="tel"
                  value={form.org_phone} onChange={e => setForm({ ...form, org_phone: e.target.value })}
                  placeholder="+91 98765 43210" />
              </div>
              <div className="setup-field">
                <label htmlFor="org-email">Business Email</label>
                <input id="org-email" type="email"
                  value={form.org_email} onChange={e => setForm({ ...form, org_email: e.target.value })}
                  placeholder="billing@company.com" />
              </div>
            </div>

            <label className="auth-checkbox gst-toggle">
              <input type="checkbox" checked={form.org_gst_registered}
                onChange={e => setForm({ ...form, org_gst_registered: e.target.checked })} />
              <span>Is this business registered for GST?</span>
            </label>

            {form.org_gst_registered && (
              <div className="setup-field fade-in">
                <label htmlFor="org-gstin">GSTIN</label>
                <input id="org-gstin" type="text"
                  value={form.org_gstin} onChange={e => setForm({ ...form, org_gstin: e.target.value })}
                  placeholder="22AAAAA0000A1Z5" maxLength={15} />
              </div>
            )}

            <div className="setup-actions">
              <button type="submit" className="btn btn-auth" disabled={loading} id="btn-save-org">
                {loading ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : 'Save & Continue'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={handleSkip} id="btn-skip-setup">
                Skip for now
              </button>
            </div>
          </form>
        </div>

        <div className="setup-right">
          <div className="setup-preview-card">
            <div className="preview-mockup">
              <div className="mockup-header">
                <div className="mockup-dot green"></div>
                <span>Dashboard : {form.org_name || 'Your Company'}</span>
              </div>
              <div className="mockup-body">
                <div className="mockup-stat">
                  <span className="mockup-label">Net Revenue</span>
                  <span className="mockup-value">₹6,38,404.00</span>
                  <div className="mockup-bar-chart">
                    <div className="mbar" style={{height: '60%'}}></div>
                    <div className="mbar" style={{height: '80%'}}></div>
                    <div className="mbar" style={{height: '45%'}}></div>
                    <div className="mbar" style={{height: '90%'}}></div>
                    <div className="mbar" style={{height: '70%'}}></div>
                  </div>
                </div>
                <div className="mockup-stat small">
                  <span className="mockup-label">Invoices</span>
                  <span className="mockup-value">₹2,533.48</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
