export default function DocumentForm({
  user, formData, onChange, onItemChange, onAddItem, onRemoveItem,
  subtotal, taxAmount, total
}) {
  const fmt = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val || 0)

  return (
    <div className="document-form" id="document-form">
      {/* Header Details */}
      <section className="form-section glass-card">
        <h2 className="section-title"><i className="fas fa-heading"></i> Header Details</h2>
        <div className="form-grid cols-2">
          <div className="form-group">
            <label htmlFor="input-title">Document Title</label>
            <select id="input-title" value={formData.title}
              onChange={e => onChange('title', e.target.value)} className="form-input">
              {user?.org_gst_registered && <option value="TAX INVOICE">TAX INVOICE</option>}
              <option value="INVOICE">INVOICE</option>
              <option value="PURCHASE ORDER">PURCHASE ORDER</option>
              <option value="PROFORMA INVOICE">PROFORMA INVOICE</option>
              <option value="CREDIT NOTE">CREDIT NOTE</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="input-doc-number">Invoice Number</label>
            <input id="input-doc-number" type="text" className="form-input"
              value={formData.doc_number} onChange={e => onChange('doc_number', e.target.value)}
              placeholder="INV-0001" />
          </div>
          <div className="form-group">
            <label htmlFor="input-date">Invoice Date</label>
            <input id="input-date" type="date" className="form-input"
              value={formData.date} onChange={e => onChange('date', e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="input-due-date">Due Date <span className="label-hint">(auto from terms)</span></label>
            <input id="input-due-date" type="date" className="form-input input-readonly"
              value={formData.due_date} readOnly />
          </div>
          {user?.org_gst_registered && (
            <div className="form-group">
              <label htmlFor="input-place">Place of Supply</label>
              <input id="input-place" type="text" className="form-input"
                value={formData.place_of_supply || ''} onChange={e => onChange('place_of_supply', e.target.value)}
                placeholder="e.g. Tamil Nadu" />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="input-terms-type">Payment Terms</label>
            <select id="input-terms-type" className="form-input"
              value={formData.payment_terms || 'Net 30'}
              onChange={e => onChange('payment_terms', e.target.value)}>
              <option>Net 15</option>
              <option>Net 30</option>
              <option>Net 45</option>
              <option>Net 60</option>
              <option>Due on Receipt</option>
            </select>
          </div>
        </div>
      </section>

      {/* Sender Details */}
      <section className="form-section glass-card">
        <h2 className="section-title"><i className="fas fa-building"></i> From (Sender)</h2>
        <div className="form-grid cols-2">
          <div className="form-group full-width">
            <label htmlFor="input-sender-name">Company / Name</label>
            <input id="input-sender-name" type="text" className="form-input"
              value={formData.sender_name} onChange={e => onChange('sender_name', e.target.value)}
              placeholder="Your Company Name" />
          </div>
          <div className="form-group full-width">
            <label htmlFor="input-sender-address">Address</label>
            <textarea id="input-sender-address" className="form-input" rows="2"
              value={formData.sender_address} onChange={e => onChange('sender_address', e.target.value)}
              placeholder="123 Business St, City, State - PIN" />
          </div>
          <div className="form-group">
            <label htmlFor="input-sender-email">Email</label>
            <input id="input-sender-email" type="email" className="form-input"
              value={formData.sender_email} onChange={e => onChange('sender_email', e.target.value)}
              placeholder="you@company.com" />
          </div>
          <div className="form-group">
            <label htmlFor="input-sender-phone">Phone</label>
            <input id="input-sender-phone" type="tel" className="form-input"
              value={formData.sender_phone} onChange={e => onChange('sender_phone', e.target.value)}
              placeholder="+91 98765 43210" />
          </div>
          {user?.org_gst_registered && (
            <div className="form-group full-width">
              <label htmlFor="input-sender-gstin">GSTIN</label>
              <input id="input-sender-gstin" type="text" className="form-input"
                value={formData.sender_gstin || ''} onChange={e => onChange('sender_gstin', e.target.value)}
                placeholder="22AAAAA0000A1Z5" maxLength={15} />
            </div>
          )}
        </div>
      </section>

      {/* Client Details */}
      <section className="form-section glass-card">
        <h2 className="section-title"><i className="fas fa-user"></i> Bill To (Client)</h2>
        <div className="form-grid cols-2">
          <div className="form-group full-width">
            <label htmlFor="input-client-name">Client Name</label>
            <input id="input-client-name" type="text" className="form-input"
              value={formData.client_name} onChange={e => onChange('client_name', e.target.value)}
              placeholder="Client Company Name" />
          </div>
          <div className="form-group full-width">
            <label htmlFor="input-client-address">Address</label>
            <textarea id="input-client-address" className="form-input" rows="2"
              value={formData.client_address} onChange={e => onChange('client_address', e.target.value)}
              placeholder="Client address" />
          </div>
          <div className="form-group">
            <label htmlFor="input-client-email">Email</label>
            <input id="input-client-email" type="email" className="form-input"
              value={formData.client_email} onChange={e => onChange('client_email', e.target.value)}
              placeholder="client@company.com" />
          </div>
          <div className="form-group">
            <label htmlFor="input-client-phone">Phone</label>
            <input id="input-client-phone" type="tel" className="form-input"
              value={formData.client_phone} onChange={e => onChange('client_phone', e.target.value)}
              placeholder="+91 12345 67890" />
          </div>
          {user?.org_gst_registered && (
            <div className="form-group full-width">
              <label htmlFor="input-client-gstin">Client GSTIN</label>
              <input id="input-client-gstin" type="text" className="form-input"
                value={formData.client_gstin || ''} onChange={e => onChange('client_gstin', e.target.value)}
                placeholder="Client GSTIN (optional)" maxLength={15} />
            </div>
          )}
        </div>
      </section>

      {/* Line Items */}
      <section className="form-section glass-card">
        <div className="section-header-row">
          <h2 className="section-title"><i className="fas fa-list"></i> Line Items</h2>
          <button className="btn btn-sm btn-add" onClick={onAddItem} id="btn-add-item">
            <i className="fas fa-plus"></i> Add Item
          </button>
        </div>
        <div className="items-list">
          {formData.items.map((item, index) => (
            <div key={index} className="item-card">
              {/* Row 1: Description + HSN */}
              <div className="item-row-top">
                <div className={`form-group ${user?.org_gst_registered ? 'item-desc-wide' : 'item-desc-full'}`}>
                  <label>Description</label>
                  <input type="text" className="form-input"
                    value={item.description}
                    onChange={e => onItemChange(index, 'description', e.target.value)}
                    placeholder="Item / service description" id={`item-desc-${index}`} />
                </div>
                {user?.org_gst_registered && (
                  <div className="form-group item-hsn-compact">
                    <label>HSN/SAC</label>
                    <input type="text" className="form-input"
                      value={item.hsn || ''}
                      onChange={e => onItemChange(index, 'hsn', e.target.value)}
                      placeholder="e.g. 9983" id={`item-hsn-${index}`} />
                  </div>
                )}
                {formData.items.length > 1 && (
                  <button className="btn-icon btn-remove item-delete" onClick={() => onRemoveItem(index)}
                    title="Remove item" id={`btn-remove-${index}`}>
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              {/* Row 2: Qty + Rate + Amount */}
              <div className="item-row-bottom">
                <div className="form-group">
                  <label>Qty</label>
                  <input type="number" className="form-input" min="0" step="1"
                    value={item.quantity}
                    onChange={e => onItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                    id={`item-qty-${index}`} />
                </div>
                <div className="form-group">
                  <label>Rate (₹)</label>
                  <input type="number" className="form-input" min="0" step="0.01"
                    value={item.unit_price}
                    onChange={e => onItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                    id={`item-price-${index}`} />
                </div>
                <div className="form-group">
                  <label>Amount</label>
                  <div className="amount-display">{fmt(item.quantity * item.unit_price)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tax & Totals */}
      <section className="form-section glass-card">
        <h2 className="section-title"><i className="fas fa-calculator"></i> Totals</h2>
        <div className="form-grid cols-2">
          <div className="form-group">
            <label htmlFor="input-tax-rate">{user?.org_gst_registered ? 'GST Rate (%)' : 'Tax Rate (%)'}</label>
            <select id="input-tax-rate" className="form-input"
              value={formData.tax_rate}
              onChange={e => onChange('tax_rate', parseFloat(e.target.value) || 0)}>
              <option value="0">0% {user?.org_gst_registered ? '(No GST)' : ''}</option>
              {user?.org_gst_registered ? (
                <>
                  <option value="5">5% (2.5% CGST + 2.5% SGST)</option>
                  <option value="12">12% (6% CGST + 6% SGST)</option>
                  <option value="18">18% (9% CGST + 9% SGST)</option>
                  <option value="28">28% (14% CGST + 14% SGST)</option>
                </>
              ) : (
                <>
                  <option value="5">5%</option>
                  <option value="10">10%</option>
                  <option value="12">12%</option>
                  <option value="15">15%</option>
                  <option value="18">18%</option>
                  <option value="20">20%</option>
                </>
              )}
            </select>
          </div>
          {!user?.org_gst_registered && (
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
              <label style={{ margin: 0 }}>Show Tax on Invoice?</label>
              <input type="checkbox" checked={formData.show_tax_field} 
                onChange={e => onChange('show_tax_field', e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="input-discount">Discount (%)</label>
            <input id="input-discount" type="number" className="form-input" min="0" max="100" step="0.5"
              value={formData.discount || 0}
              onChange={e => onChange('discount', parseFloat(e.target.value) || 0)} />
          </div>
        </div>
        <div className="totals-summary">
          <div className="total-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
          {formData.discount > 0 && (
            <div className="total-row"><span>Discount ({formData.discount}%)</span><span>-{fmt(subtotal * formData.discount / 100)}</span></div>
          )}
          {formData.tax_rate > 0 && (
            user?.org_gst_registered ? (
              <>
                <div className="total-row"><span>CGST ({formData.tax_rate / 2}%)</span><span>{fmt(subtotal * formData.tax_rate / 200)}</span></div>
                <div className="total-row"><span>SGST ({formData.tax_rate / 2}%)</span><span>{fmt(subtotal * formData.tax_rate / 200)}</span></div>
              </>
            ) : (
              formData.show_tax_field && <div className="total-row"><span>Tax ({formData.tax_rate}%)</span><span>{fmt(subtotal * formData.tax_rate / 100)}</span></div>
            )
          )}
          <div className="total-row total-final"><span>Total</span><span>{fmt(total)}</span></div>
        </div>
      </section>

      {/* Bank Details */}
      <section className="form-section glass-card">
        <h2 className="section-title"><i className="fas fa-university"></i> Bank Details</h2>
        <div className="form-grid cols-2">
          <div className="form-group">
            <label htmlFor="input-bank-name">Bank Name</label>
            <input id="input-bank-name" type="text" className="form-input"
              value={formData.bank_name || ''} onChange={e => onChange('bank_name', e.target.value)}
              placeholder="e.g. State Bank of India" />
          </div>
          <div className="form-group">
            <label htmlFor="input-bank-account">Account Number</label>
            <input id="input-bank-account" type="text" className="form-input"
              value={formData.bank_account || ''} onChange={e => onChange('bank_account', e.target.value)}
              placeholder="XXXX XXXX XXXX" />
          </div>
          <div className="form-group">
            <label htmlFor="input-bank-ifsc">IFSC Code</label>
            <input id="input-bank-ifsc" type="text" className="form-input"
              value={formData.bank_ifsc || ''} onChange={e => onChange('bank_ifsc', e.target.value)}
              placeholder="e.g. SBIN0001234" />
          </div>
          <div className="form-group">
            <label htmlFor="input-bank-branch">Branch</label>
            <input id="input-bank-branch" type="text" className="form-input"
              value={formData.bank_branch || ''} onChange={e => onChange('bank_branch', e.target.value)}
              placeholder="e.g. Koramangala, Bangalore" />
          </div>
        </div>
      </section>

      {/* Notes & Terms */}
      <section className="form-section glass-card">
        <h2 className="section-title"><i className="fas fa-sticky-note"></i> Notes &amp; Terms</h2>
        <div className="form-group">
          <label htmlFor="input-notes">Notes</label>
          <textarea id="input-notes" className="form-input" rows="2"
            value={formData.notes} onChange={e => onChange('notes', e.target.value)}
            placeholder="Any additional notes..." />
        </div>
        <div className="form-group">
          <label htmlFor="input-terms">Terms & Conditions</label>
          <textarea id="input-terms" className="form-input" rows="2"
            value={formData.terms} onChange={e => onChange('terms', e.target.value)}
            placeholder="Payment terms and conditions..." />
        </div>
      </section>
    </div>
  )
}
