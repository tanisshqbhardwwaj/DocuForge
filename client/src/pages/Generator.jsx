import { useState, useRef, useCallback, useEffect } from 'react'
import DocumentForm from '../components/DocumentForm'
import DocumentPreview from '../components/DocumentPreview'
import Toast from '../components/Toast'
import { useAuth } from '../context/AuthContext'

export default function Generator() {
  const { user, authFetch } = useAuth()
  const STORAGE_KEY = `docuforge_draft_${user?.id || 'anon'}`

  // Auto-fill sender details from organization profile
  const defaultState = () => ({
    title: user?.org_gst_registered ? 'TAX INVOICE' : 'INVOICE',
    doc_number: `INV-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    sender_name: user?.org_name || user?.company_name || '',
    sender_address: user?.org_address || '',
    sender_email: user?.org_email || user?.email || '',
    sender_phone: user?.org_phone || user?.phone || '',
    sender_gstin: user?.org_gstin || '',
    client_name: '',
    client_address: '',
    client_email: '',
    client_phone: '',
    client_gstin: '',
    place_of_supply: user?.org_state || '',
    payment_terms: 'Net 30',
    items: [{ description: '', quantity: 1, unit_price: 0, hsn: '' }],
    tax_rate: user?.org_gst_registered ? 18 : 0,
    show_tax_field: true,
    discount: 0,
    notes: '',
    terms: 'Please pay the invoice before the due date.',
    bank_name: '', bank_account: '', bank_ifsc: '', bank_branch: '',
  })

  // Restore draft from localStorage if available
  const getInitialState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Merge with defaults so new fields are always present
        return { ...defaultState(), ...parsed }
      }
    } catch { /* ignore corrupt data */ }
    return defaultState()
  }

  const [formData, setFormData] = useState(getInitialState)

  // Update form when user profile is loaded (initial load)
  useEffect(() => {
    if (user && !localStorage.getItem(STORAGE_KEY)) {
      setFormData(defaultState())
    }
  }, [user])

  const [toast, setToast] = useState(null)
  const [saving, setSaving] = useState(false)
  const previewRef = useRef(null)

  // Auto-save form data to localStorage on every change
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
      }
    } catch { /* quota exceeded — ignore */ }
  }, [formData, STORAGE_KEY, user])

  // Derived calculations
  const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
  const taxAmount = subtotal * (formData.tax_rate / 100)
  const total = subtotal + taxAmount

  // Helper: calculate due date from invoice date + payment terms
  const calcDueDate = (invoiceDate, terms) => {
    const base = new Date(invoiceDate)
    if (isNaN(base.getTime())) return ''
    let days = 30
    if (terms === 'Due on Receipt') days = 0
    else {
      const match = terms?.match(/Net\s+(\d+)/)
      if (match) days = parseInt(match[1], 10)
    }
    base.setDate(base.getDate() + days)
    return base.toISOString().split('T')[0]
  }

  const handleChange = useCallback((field, value) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value }
      
      // 1. Auto-sync due_date when payment terms or invoice date changes
      if (field === 'payment_terms') {
        next.due_date = calcDueDate(prev.date, value)
      } else if (field === 'date') {
        next.due_date = calcDueDate(value, prev.payment_terms)
      }

      // 2. Auto-swap prefix based on document title
      if (field === 'title') {
        const numOnly = prev.doc_number.replace(/^(INV-|PO-|PI-|CN-)/, '')
        
        if (value === 'PURCHASE ORDER') {
          next.doc_number = `PO-${numOnly}`
        } else if (value === 'PROFORMA INVOICE') {
          next.doc_number = `PI-${numOnly}`
        } else if (value === 'CREDIT NOTE') {
          next.doc_number = `CN-${numOnly}`
        } else if (value.includes('INVOICE')) {
          next.doc_number = `INV-${numOnly}`
        }
      }
      
      return next
    })
  }, [])

  const handleItemChange = useCallback((index, field, value) => {
    setFormData(prev => {
      const items = [...prev.items]
      items[index] = { ...items[index], [field]: value }
      return { ...prev, items }
    })
  }, [])

  const addItem = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unit_price: 0 }]
    }))
  }, [])

  const removeItem = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }, [])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const handleGeneratePDF = async () => {
    if (saving) return
    setSaving(true)

    try {
      // 1. Save to database via POST
      const docPayload = {
        ...formData,
        doc_type: formData.title.toLowerCase().includes('purchase') ? 'purchase_order' : 'invoice',
        subtotal,
        tax_amount: taxAmount,
        total,
      }

      const res = await authFetch('/api/documents', {
        method: 'POST',
        body: JSON.stringify(docPayload),
      })

      if (!res.ok) throw new Error('Failed to save document')

      // 2. Generate PDF from preview
      const element = previewRef.current
      if (!element) throw new Error('Preview not found')

      const html2pdf = (await import('html2pdf.js')).default

      const pdfFilename = `${formData.doc_number}.pdf`

      const opt = {
        margin: [10, 10, 10, 10],
        filename: pdfFilename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          scrollY: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      }

      // Use outputPdf('blob') + manual download to guarantee correct filename
      const pdfBlob = await html2pdf().set(opt).from(element).outputPdf('blob')

      // Trigger download with the correct filename
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = pdfFilename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      showToast('Document saved & PDF downloaded!', 'success')

      // Reset form and clear draft
      const fresh = defaultState()
      setFormData(fresh)
      localStorage.removeItem(STORAGE_KEY)
    } catch (err) {
      console.error(err)
      showToast(err.message || 'Something went wrong', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="generator-page">
      <div className="generator-header">
        <div>
          <h1 id="generator-title">
            <i className="fas fa-magic"></i> Document Generator
          </h1>
          <p className="subtitle">Fill in the details and watch your document come to life</p>
        </div>
        <button
          className="btn btn-primary btn-generate"
          onClick={handleGeneratePDF}
          disabled={saving}
          id="btn-generate-pdf"
        >
          {saving ? (
            <><i className="fas fa-spinner fa-spin"></i> Processing...</>
          ) : (
            <><i className="fas fa-file-pdf"></i> Generate &amp; Download PDF</>
          )}
        </button>
      </div>

      <div className="split-pane">
        <div className="pane-left" id="document-form">
          <DocumentForm
            user={user}
            formData={formData}
            onChange={handleChange}
            onItemChange={handleItemChange}
            onAddItem={addItem}
            onRemoveItem={removeItem}
            subtotal={subtotal}
            taxAmount={taxAmount}
            total={total}
          />
        </div>
        <div className="pane-right">
          <div className="preview-wrapper">
            <div className="preview-label">
              <i className="fas fa-eye"></i> Live Preview
            </div>
            <DocumentPreview
              user={user}
              ref={previewRef}
              data={formData}
              subtotal={subtotal}
              taxAmount={taxAmount}
              total={total}
            />
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
