import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import DocumentPreview from '../components/DocumentPreview'

export default function History() {
  const { authFetch } = useAuth()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortField, setSortField] = useState('date')     // 'date' | 'total'
  const [sortDir, setSortDir] = useState('desc')          // 'asc' | 'desc'
  const [filterType, setFilterType] = useState('all')     // 'all' | 'invoice' | 'purchase_order'
  const [viewDoc, setViewDoc] = useState(null)            // document to view in modal

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await authFetch('/api/documents')
      if (!res.ok) throw new Error('Failed to fetch documents')
      const data = await res.json()
      setDocuments(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()  // Prevent the row click from opening the viewer
    if (!window.confirm('Delete this document?')) return
    try {
      const res = await authFetch(`/api/documents/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to delete')
      }
      setDocuments(prev => prev.filter(d => d.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  const handleUpdatePayment = async (id, paymentData) => {
    try {
      const res = await authFetch(`/api/documents/${id}/payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      })
      if (!res.ok) throw new Error('Failed to update payment status')
      
      setDocuments(prev => prev.map(d => 
        d.id === id ? { ...d, ...paymentData, payment_status: paymentData.status } : d
      ))
      if (viewDoc && viewDoc.id === id) {
        setViewDoc(prev => ({ ...prev, ...paymentData, payment_status: paymentData.status }))
      }
    } catch (err) {
      alert(err.message)
    }
  }

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val || 0)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'short', day: 'numeric'
      })
    } catch {
      return dateStr
    }
  }

  // Filter & Sort
  const processed = [...documents]
    .filter(d => filterType === 'all' || d.doc_type === filterType)
    .sort((a, b) => {
      let cmp = 0
      if (sortField === 'date') {
        cmp = new Date(a.date || 0) - new Date(b.date || 0)
      } else if (sortField === 'total') {
        cmp = (a.total || 0) - (b.total || 0)
      }
      return sortDir === 'asc' ? cmp : -cmp
    })

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const sortIcon = (field) => {
    if (sortField !== field) return <i className="fas fa-sort sort-icon-dim"></i>
    return sortDir === 'asc'
      ? <i className="fas fa-sort-up sort-icon-active"></i>
      : <i className="fas fa-sort-down sort-icon-active"></i>
  }

  // Build preview-compatible data from a saved document
  const buildPreviewData = (doc) => ({
    title: doc.title || 'TAX INVOICE',
    doc_number: doc.doc_number || '',
    date: doc.date || '',
    due_date: doc.due_date || '',
    sender_name: doc.sender_name || '',
    sender_address: doc.sender_address || '',
    sender_email: doc.sender_email || '',
    sender_phone: doc.sender_phone || '',
    sender_gstin: doc.sender_gstin || '',
    client_name: doc.client_name || '',
    client_address: doc.client_address || '',
    client_email: doc.client_email || '',
    client_phone: doc.client_phone || '',
    client_gstin: doc.client_gstin || '',
    place_of_supply: doc.place_of_supply || '',
    payment_terms: doc.payment_terms || 'Net 30',
    items: doc.items || [],
    tax_rate: doc.tax_rate || 0,
    discount: doc.discount || 0,
    notes: doc.notes || '',
    terms: doc.terms || '',
    bank_name: doc.bank_name || '',
    bank_account: doc.bank_account || '',
    bank_ifsc: doc.bank_ifsc || '',
    bank_branch: doc.bank_branch || '',
  })

  // Stats
  const totalDocs = documents.length
  const totalValue = documents.reduce((sum, d) => sum + (d.total || 0), 0)
  const paidValue = documents.filter(d => d.payment_status === 'paid').reduce((sum, d) => sum + (d.total || 0), 0)
  const unpaidCount = documents.filter(d => d.payment_status !== 'paid').length

  if (loading) {
    return (
      <div className="history-page">
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="history-page">
      <div className="history-header">
        <div>
          <h1 id="history-title"><i className="fas fa-history"></i> Document History</h1>
          <p className="subtitle">View all previously generated documents</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchDocuments} id="btn-refresh">
          <i className="fas fa-sync-alt"></i> Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card" id="stat-total">
          <div className="stat-icon purple"><i className="fas fa-file-alt"></i></div>
          <div className="stat-info">
            <span className="stat-value">{totalDocs}</span>
            <span className="stat-label">Total Documents</span>
          </div>
        </div>
        <div className="stat-card" id="stat-revenue">
          <div className="stat-icon green"><i className="fas fa-rupee-sign"></i></div>
          <div className="stat-info">
            <span className="stat-value">{formatCurrency(totalValue)}</span>
            <span className="stat-label">Total Document Value</span>
          </div>
        </div>
        <div className="stat-card" id="stat-paid">
          <div className="stat-icon blue"><i className="fas fa-check-circle"></i></div>
          <div className="stat-info">
            <span className="stat-value">{formatCurrency(paidValue)}</span>
            <span className="stat-label">Total Paid</span>
          </div>
        </div>
        <div className="stat-card" id="stat-unpaid">
          <div className="stat-icon orange"><i className="fas fa-clock"></i></div>
          <div className="stat-info">
            <span className="stat-value">{unpaidCount}</span>
            <span className="stat-label">Unpaid Bills</span>
          </div>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      {documents.length > 0 && (
        <div className="filter-bar" id="filter-bar">
          <div className="filter-section">
            <span className="filter-label">Filter:</span>
            <div className="filter-pills">
              <button
                className={`filter-pill ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => setFilterType('all')}
                id="filter-all"
              >
                All <span className="pill-count">{totalDocs}</span>
              </button>
              <button
                className={`filter-pill ${filterType === 'invoice' ? 'active' : ''}`}
                onClick={() => setFilterType('invoice')}
                id="filter-invoices"
              >
                Invoices
              </button>
              <button
                className={`filter-pill ${filterType === 'purchase_order' ? 'active' : ''}`}
                onClick={() => setFilterType('purchase_order')}
                id="filter-pos"
              >
                POs
              </button>
            </div>
          </div>

          <div className="filter-section">
            <span className="filter-label">Sort By:</span>
            <div className="filter-pills">
              <button
                className={`filter-pill ${sortField === 'date' ? 'active' : ''}`}
                onClick={() => toggleSort('date')}
                id="sort-btn-date"
              >
                <i className="fas fa-calendar-alt"></i> Date {sortField === 'date' && sortIcon('date')}
              </button>
              <button
                className={`filter-pill ${sortField === 'total' ? 'active' : ''}`}
                onClick={() => toggleSort('total')}
                id="sort-btn-total"
              >
                <i className="fas fa-rupee-sign"></i> Amount {sortField === 'total' && sortIcon('total')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Documents Table */}
      {error ? (
        <div className="error-state">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
          <button className="btn btn-secondary" onClick={fetchDocuments}>Try Again</button>
        </div>
      ) : documents.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-folder-open"></i>
          <h3>No documents yet</h3>
          <p>Generated documents will appear here. Go create your first one!</p>
        </div>
      ) : processed.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-filter"></i>
          <h3>No matching documents</h3>
          <p>Try a different filter to see your documents.</p>
        </div>
      ) : (
        <div className="table-container glass-card">
          <table className="doc-table" id="documents-table">
            <thead>
              <tr>
                <th>Document #</th>
                <th>Type</th>
                <th>Client</th>
                <th className="sortable-th" onClick={() => toggleSort('date')} id="th-sort-date">
                  Date {sortIcon('date')}
                </th>
                <th>Payment</th>
                <th className="sortable-th" onClick={() => toggleSort('total')} id="th-sort-total">
                  Total {sortIcon('total')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {processed.map(doc => (
                <tr
                  key={doc.id}
                  className="table-row table-row-clickable"
                  onClick={() => setViewDoc(doc)}
                  title="Click to view document"
                >
                  <td>
                    <span className="doc-number">{doc.doc_number}</span>
                  </td>
                  <td>
                    <span className={`badge ${doc.doc_type === 'invoice' ? 'badge-blue' : 'badge-orange'}`}>
                      {doc.doc_type === 'invoice' ? 'Invoice' : 'Purchase Order'}
                    </span>
                  </td>
                  <td className="client-cell">{doc.client_name || '—'}</td>
                  <td>{formatDate(doc.date)}</td>
                  <td>
                    <span className={`badge ${doc.payment_status === 'paid' ? 'badge-green' : 'badge-gray'}`}>
                      {doc.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="total-cell">{formatCurrency(doc.total)}</td>
                  <td>
                    <button
                      className="btn-icon btn-view"
                      onClick={(e) => { e.stopPropagation(); setViewDoc(doc); }}
                      title="View document"
                      id={`btn-view-${doc.id}`}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={(e) => handleDelete(e, doc.id)}
                      title="Delete document"
                      id={`btn-delete-${doc.id}`}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Document Viewer Modal */}
      {viewDoc && (
        <div className="modal-overlay" onClick={() => setViewDoc(null)} id="doc-viewer-modal">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <h2><i className="fas fa-file-invoice"></i> {viewDoc.doc_number}</h2>
                <span className={`badge ${viewDoc.doc_type === 'invoice' ? 'badge-blue' : 'badge-orange'}`}>
                  {viewDoc.doc_type === 'invoice' ? 'Invoice' : 'Purchase Order'}
                </span>
                <span className={`badge ${viewDoc.payment_status === 'paid' ? 'badge-green' : 'badge-gray'}`}>
                  {viewDoc.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                </span>
              </div>
              <button className="btn-icon modal-close" onClick={() => setViewDoc(null)} id="btn-close-modal">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-sidebar">
                <div className="sidebar-section">
                  <h3>Payment Status</h3>
                  <div className="payment-control">
                    <select 
                      value={viewDoc.payment_status || 'unpaid'} 
                      onChange={(e) => handleUpdatePayment(viewDoc.id, { 
                        status: e.target.value,
                        method: viewDoc.payment_method,
                        transaction_id: viewDoc.transaction_id
                      })}
                      className="form-input"
                    >
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                  
                  {viewDoc.payment_status === 'paid' && (
                    <div className="payment-details-edit">
                      <div className="form-group">
                        <label>Method</label>
                        <select 
                          value={viewDoc.payment_method || ''} 
                          onChange={(e) => handleUpdatePayment(viewDoc.id, { 
                            status: 'paid',
                            method: e.target.value,
                            transaction_id: viewDoc.transaction_id
                          })}
                          className="form-input"
                        >
                          <option value="">Select</option>
                          <option value="Cash">Cash</option>
                          <option value="Online">Online</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                      </div>
                      {viewDoc.payment_method === 'Online' && (
                        <div className="form-group">
                          <label>Transaction ID</label>
                          <input 
                            type="text" 
                            className="form-input"
                            value={viewDoc.transaction_id || ''}
                            onChange={(e) => handleUpdatePayment(viewDoc.id, { 
                              status: 'paid',
                              method: 'Online',
                              transaction_id: e.target.value
                            })}
                            onBlur={(e) => handleUpdatePayment(viewDoc.id, { 
                              status: 'paid',
                              method: 'Online',
                              transaction_id: e.target.value
                            })}
                            placeholder="Enter TXN ID"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-main">
                <DocumentPreview
                  data={buildPreviewData(viewDoc)}
                  subtotal={viewDoc.subtotal || 0}
                  taxAmount={viewDoc.tax_amount || 0}
                  total={viewDoc.total || 0}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

