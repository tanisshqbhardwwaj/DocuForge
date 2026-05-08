import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";

export default function Profile() {
  const { user, saveOrganization, authFetch } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    org_name: "",
    org_industry: "",
    org_location: "India",
    org_state: "",
    org_currency: "INR - Indian Rupee",
    org_gst_registered: false,
    org_gstin: "",
    org_address: "",
    org_phone: "",
    org_email: "",
    org_logo: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        org_name: user.org_name || user.company_name || "",
        org_industry: user.org_industry || "",
        org_location: user.org_location || "India",
        org_state: user.org_state || "",
        org_currency: user.org_currency || "INR - Indian Rupee",
        org_gst_registered:
          user.org_gst_registered === 1 || user.org_gst_registered === true,
        org_gstin: user.org_gstin || "",
        org_address: user.org_address || "",
        org_phone: user.org_phone || user.phone || "",
        org_email: user.org_email || user.email || "",
        org_logo: user.org_logo || "",
      });
    }
  }, [user]);

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveOrganization(form);
      setToast({ message: "Profile updated successfully!", type: "success" });
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, org_logo: reader.result });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-page fade-in">
      <div className="profile-header">
        <h1>
          <i className="fas fa-user-tie"></i> Organization Profile
        </h1>
        <p className="subtitle">Manage your business details and branding</p>
      </div>

      <form onSubmit={handleSubmit} className="profile-form glass-card">
        <div className="profile-sections">
          {/* Logo Section */}
          <div className="profile-section logo-section">
            <h3 className="section-title">
              <i className="fas fa-image"></i> Business Branding
            </h3>
            <div className="logo-edit-wrapper">
              <div className="logo-preview-large">
                {form.org_logo ? (
                  <img src={form.org_logo} alt="Logo" />
                ) : (
                  <div className="logo-placeholder">
                    <i className="fas fa-building"></i>
                    <span>No Logo</span>
                  </div>
                )}
              </div>
              <div className="logo-controls">
                <label className="btn btn-secondary btn-sm">
                  <i className="fas fa-upload"></i> Change Logo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </label>
                {form.org_logo && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm text-danger"
                    onClick={() => setForm({ ...form, org_logo: "" })}
                  >
                    <i className="fas fa-trash"></i> Remove
                  </button>
                )}
                <p className="field-hint">Used in your invoices and emails</p>
              </div>
            </div>
          </div>

          <div className="profile-grid">
            <div className="profile-section">
              <h3 className="section-title">
                <i className="fas fa-info-circle"></i> General Details
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Business Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.org_name}
                    onChange={(e) =>
                      setForm({ ...form, org_name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Industry</label>
                  <select
                    className="form-input"
                    value={form.org_industry}
                    onChange={(e) =>
                      setForm({ ...form, org_industry: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Industry</option>
                    <option>Technology / Software</option>
                    <option>Manufacturing</option>
                    <option>Retail / E-commerce</option>
                    <option>Services / Consulting</option>
                    <option>Healthcare</option>
                    <option>Education</option>
                    <option>Construction / Real Estate</option>
                    <option>Logistics / Transport</option>
                    <option>Food & Beverage</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3 className="section-title">
                <i className="fas fa-map-marker-alt"></i> Location & Tax
              </h3>
              <div className="form-grid cols-2">
                <div className="form-group">
                  <label>State</label>
                  <select
                    className="form-input"
                    value={form.org_state}
                    onChange={(e) =>
                      setForm({ ...form, org_state: e.target.value })
                    }
                    required
                  >
                    <option value="">Select State</option>
                    {states.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Currency</label>
                  <input
                    type="text"
                    className="form-input input-readonly"
                    value={form.org_currency}
                    readOnly
                  />
                </div>
                <div className="form-group full-width">
                  <label className="auth-checkbox">
                    <input
                      type="checkbox"
                      checked={form.org_gst_registered}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          org_gst_registered: e.target.checked,
                        })
                      }
                    />
                    <span>Registered for GST</span>
                  </label>
                </div>
                {form.org_gst_registered && (
                  <div className="form-group full-width fade-in">
                    <label>GSTIN</label>
                    <input
                      type="text"
                      className="form-input"
                      value={form.org_gstin}
                      onChange={(e) =>
                        setForm({ ...form, org_gstin: e.target.value })
                      }
                      placeholder="22AAAAA0000A1Z5"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="profile-section">
              <h3 className="section-title">
                <i className="fas fa-address-book"></i> Contact Info
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={form.org_email}
                    onChange={(e) =>
                      setForm({ ...form, org_email: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={form.org_phone}
                    onChange={(e) =>
                      setForm({ ...form, org_phone: e.target.value })
                    }
                  />
                </div>
                <div className="form-group full-width">
                  <label>Address</label>
                  <textarea
                    className="form-input"
                    rows="3"
                    value={form.org_address}
                    onChange={(e) =>
                      setForm({ ...form, org_address: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button
            type="submit"
            className="btn btn-primary btn-generate"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i> Save Profile Changes
              </>
            )}
          </button>
        </div>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
