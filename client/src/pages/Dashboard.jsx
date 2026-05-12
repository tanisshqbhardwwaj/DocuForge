import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, authFetch } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [docFilter, setDocFilter] = useState("all");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await authFetch("/api/documents");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setDocuments(data);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(val || 0);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    } catch { return dateStr; }
  };

  // Financial Calculations
  const invoices = documents.filter(d => d.doc_type === "invoice");
  const invoiceTotal = invoices.reduce((s, d) => s + (d.total || 0), 0);
  const paidInvoiceAmount = invoices.filter(d => d.payment_status === "paid").reduce((s, d) => s + (d.total || 0), 0);
  const pendingInvoiceAmount = invoiceTotal - paidInvoiceAmount;
  
  const creditNoteTotal = documents.filter(d => d.doc_type === "credit_note").reduce((s, d) => s + (d.total || 0), 0);
  const poTotal = documents.filter(d => d.doc_type === "purchase_order").reduce((s, d) => s + (d.total || 0), 0);

  const totalDocs = documents.length;

  // Unique clients
  const recentClients = [...new Map(documents.filter(d => d.client_name).map(d => [d.client_name, d])).values()].slice(0, 4);

  // Doc filter
  const filteredDocs = documents
    .filter(d => {
      if (docFilter === "all") return true;
      if (docFilter === "invoices") return d.doc_type === "invoice";
      if (docFilter === "po") return d.doc_type === "purchase_order";
      if (docFilter === "credit_notes") return d.doc_type === "credit_note";
      return true;
    })
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 5);

  const statusBadge = (status) => {
    const map = {
      paid: { bg: "#0d3b2e", color: "#34d399", label: "Paid" },
      unpaid: { bg: "#3b2e0d", color: "#fbbf24", label: "Pending" },
      draft: { bg: "#2a2a3a", color: "#94a3b8", label: "Draft" },
      sent: { bg: "#0d2b3b", color: "#38bdf8", label: "Sent" },
    };
    const s = map[status] || map.unpaid;
    return (
      <span style={{ background: s.bg, color: s.color, padding: "3px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "600" }}>
        {s.label}
      </span>
    );
  };

  const paidPct = invoiceTotal > 0 ? Math.round((paidInvoiceAmount / invoiceTotal) * 100) : 0;
  const pendingPct = 100 - paidPct;

  const userName = user?.org_name || user?.company_name || user?.email?.split("@")[0] || "User";

  const clientColors = ["#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
  const getClientInitial = (name) => (name || "?")[0].toUpperCase();
  const getClientColor = (i) => clientColors[i % clientColors.length];

  return (
    <div className="dashboard-page">
      <div className="dashboard-main">
        {/* Welcome Header */}
        <div className="dash-welcome-bar">
          <div>
            <h1 className="dash-welcome-title">Welcome back, {userName} 👋</h1>
            <p className="dash-welcome-sub">Create professional invoices, purchase orders and manage your business.</p>
          </div>
          <div className="dash-welcome-actions">
            <button className="dash-btn-primary" onClick={() => navigate("/create")}>
              <i className="fas fa-plus"></i> New Document <i className="fas fa-chevron-down" style={{ marginLeft: '6px', fontSize: '0.7rem' }}></i>
            </button>
          </div>
        </div>

        {/* Quick Create */}
        <div className="dash-section">
          <div className="dash-section-header">
            <h2>Quick Create</h2>
          </div>
          <div className="dash-quick-grid">
            <div className="dash-quick-card" style={{ '--accent': '#6366f1' }} onClick={() => navigate("/create", { state: { type: "invoice" } })}>
              <div className="dash-quick-icon" style={{ background: 'rgba(99,102,241,0.15)' }}>
                <i className="fas fa-file-invoice-dollar" style={{ color: '#6366f1' }}></i>
              </div>
              <div className="dash-quick-info">
                <h3>Create Invoice</h3>
                <p>Generate new invoice</p>
              </div>
              <i className="fas fa-arrow-right dash-quick-arrow"></i>
            </div>
            <div className="dash-quick-card" style={{ '--accent': '#3b82f6' }} onClick={() => navigate("/create", { state: { type: "po" } })}>
              <div className="dash-quick-icon" style={{ background: 'rgba(59,130,246,0.15)' }}>
                <i className="fas fa-shopping-cart" style={{ color: '#3b82f6' }}></i>
              </div>
              <div className="dash-quick-info">
                <h3>Purchase Order</h3>
                <p>Request items from vendor</p>
              </div>
              <i className="fas fa-arrow-right dash-quick-arrow"></i>
            </div>
            <div className="dash-quick-card" style={{ '--accent': '#f43f5e' }} onClick={() => navigate("/create", { state: { type: "credit_note" } })}>
              <div className="dash-quick-icon" style={{ background: 'rgba(244,63,94,0.15)' }}>
                <i className="fas fa-undo" style={{ color: '#f43f5e' }}></i>
              </div>
              <div className="dash-quick-info">
                <h3>Credit Note</h3>
                <p>Issue credit or refund</p>
              </div>
              <i className="fas fa-arrow-right dash-quick-arrow"></i>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="dash-stats-grid">
          <div className="dash-stat-card">
            <div className="dash-stat-icon" style={{ background: 'rgba(99,102,241,0.15)' }}>
              <i className="fas fa-file-invoice-dollar" style={{ color: '#6366f1' }}></i>
            </div>
            <div className="dash-stat-body">
              <span className="dash-stat-value">{formatCurrency(invoiceTotal)}</span>
              <span className="dash-stat-label">Invoice Total</span>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon" style={{ background: 'rgba(244,63,94,0.15)' }}>
              <i className="fas fa-minus-square" style={{ color: '#f43f5e' }}></i>
            </div>
            <div className="dash-stat-body">
              <span className="dash-stat-value">{formatCurrency(creditNoteTotal)}</span>
              <span className="dash-stat-label">Credit Note Total</span>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon" style={{ background: 'rgba(59,130,246,0.15)' }}>
              <i className="fas fa-shopping-cart" style={{ color: '#3b82f6' }}></i>
            </div>
            <div className="dash-stat-body">
              <span className="dash-stat-value">{formatCurrency(poTotal)}</span>
              <span className="dash-stat-label">PO Total</span>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>
              <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>
            </div>
            <div className="dash-stat-body">
              <span className="dash-stat-value">{formatCurrency(paidInvoiceAmount)}</span>
              <span className="dash-stat-label">Paid Invoices</span>
            </div>
          </div>
        </div>

        {/* Recent Documents */}
        <div className="dash-section">
          <div className="dash-section-header">
            <h2>Recent Documents</h2>
            <button className="dash-link-btn" onClick={() => navigate("/history")}>View All <i className="fas fa-arrow-right"></i></button>
          </div>
          <div className="dash-doc-tabs">
            {[
              { key: "all", label: "All" },
              { key: "invoices", label: "Invoices" },
              { key: "po", label: "Purchase Orders" },
              { key: "credit_notes", label: "Credit Notes" },
            ].map(tab => (
              <button key={tab.key}
                className={`dash-doc-tab ${docFilter === tab.key ? "active" : ""}`}
                onClick={() => setDocFilter(tab.key)}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="dash-table-wrap">
            {loading ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
                <i className="fas fa-spinner fa-spin"></i> Loading...
              </div>
            ) : filteredDocs.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
                <i className="fas fa-folder-open" style={{ fontSize: '2rem', marginBottom: '10px', display: 'block' }}></i>
                No documents yet. Create your first one!
              </div>
            ) : (
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Document No.</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map(doc => (
                    <tr key={doc.id}>
                      <td style={{ fontWeight: '600' }}>{doc.doc_number}</td>
                      <td>{doc.client_name || "—"}</td>
                      <td>{formatDate(doc.date)}</td>
                      <td style={{ fontWeight: '600' }}>{formatCurrency(doc.total)}</td>
                      <td>{statusBadge(doc.payment_status)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="dash-icon-btn" title="View" onClick={() => navigate("/history")}><i className="fas fa-eye"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Pro Tip */}
        <div className="dash-pro-tip">
          <div className="dash-pro-tip-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <i className="fas fa-lightbulb" style={{ color: '#fbbf24', fontSize: '1.3rem' }}></i>
              <div>
                <strong style={{ color: '#fbbf24' }}>Pro Tip</strong>
                <p style={{ margin: '2px 0 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>You can create recurring invoices for your regular clients and save time.</p>
              </div>
            </div>
            <button className="dash-tip-btn" onClick={() => navigate("/create")}>Learn More</button>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="dashboard-sidebar">
        <div className="dash-sidebar-card">
          <div className="dash-sidebar-header">
            <h3>Recent Clients</h3>
            <button className="dash-link-btn" onClick={() => navigate("/history")}>View All</button>
          </div>
          <div className="dash-client-list">
            {recentClients.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', padding: '15px 0' }}>No clients yet</p>
            ) : (
              recentClients.map((doc, i) => (
                <div key={i} className="dash-client-row">
                  <div className="dash-client-avatar" style={{ background: getClientColor(i) }}>
                    {getClientInitial(doc.client_name)}
                  </div>
                  <div className="dash-client-info">
                    <span className="dash-client-name">{doc.client_name}</span>
                    <span className="dash-client-email">{doc.client_email || "—"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dash-sidebar-card">
          <div className="dash-sidebar-header">
            <h3>Analytics Overview</h3>
          </div>
          <div className="dash-analytics">
            <div className="dash-donut-container">
              <svg viewBox="0 0 120 120" className="dash-donut">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="18" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#10b981" strokeWidth="18"
                  strokeDasharray={`${paidPct * 3.14} ${(100 - paidPct) * 3.14}`}
                  strokeDashoffset="0" transform="rotate(-90 60 60)" strokeLinecap="round" />
                {pendingPct > 0 && (
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#f43f5e" strokeWidth="18"
                    strokeDasharray={`${pendingPct * 3.14} ${(100 - pendingPct) * 3.14}`}
                    strokeDashoffset={`-${paidPct * 3.14}`} transform="rotate(-90 60 60)" strokeLinecap="round" />
                )}
              </svg>
              <div className="dash-donut-center">
                <span className="dash-donut-value">{formatCurrency(invoiceTotal)}</span>
                <span className="dash-donut-label">Invoice Revenue</span>
              </div>
            </div>
            <div className="dash-legend">
              <div className="dash-legend-item">
                <span className="dash-legend-dot" style={{ background: '#10b981' }}></span>
                <span>Paid</span>
                <span className="dash-legend-val">{formatCurrency(paidInvoiceAmount)} ({paidPct}%)</span>
              </div>
              <div className="dash-legend-item">
                <span className="dash-legend-dot" style={{ background: '#f43f5e' }}></span>
                <span>Pending</span>
                <span className="dash-legend-val">{formatCurrency(pendingInvoiceAmount)} ({pendingPct}%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dash-sidebar-card">
          <div className="dash-sidebar-header">
            <h3>Shortcuts</h3>
          </div>
          <div className="dash-shortcut-list">
            <div className="dash-shortcut" onClick={() => navigate("/profile")}>
              <div className="dash-shortcut-icon"><i className="fas fa-building"></i></div>
              <div className="dash-shortcut-info">
                <span className="dash-shortcut-title">Business Profile</span>
                <span className="dash-shortcut-desc">Update your details</span>
              </div>
              <i className="fas fa-chevron-right dash-shortcut-arrow"></i>
            </div>
            <div className="dash-shortcut" onClick={() => navigate("/history")}>
              <div className="dash-shortcut-icon"><i className="fas fa-history"></i></div>
              <div className="dash-shortcut-info">
                <span className="dash-shortcut-title">Document History</span>
                <span className="dash-shortcut-desc">View all past documents</span>
              </div>
              <i className="fas fa-chevron-right dash-shortcut-arrow"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
