export default function CreditNoteForm({
  user, formData, onChange, onItemChange, onAddItem, onRemoveItem,
  onAddCharge, onRemoveCharge, onChargeChange,
  onFocusSection, subtotal, taxAmount, total
}) {
  const currencyMap = {
    'INR': { locale: 'en-IN', code: 'INR', symbol: '₹' },
    'USD': { locale: 'en-US', code: 'USD', symbol: '$' },
    'EUR': { locale: 'de-DE', code: 'EUR', symbol: '€' },
    'GBP': { locale: 'en-GB', code: 'GBP', symbol: '£' },
    'AED': { locale: 'ar-AE', code: 'AED', symbol: 'د.إ' }
  };

  const currentCurrency = currencyMap[formData.currency || 'INR'];

  const fmt = (val) =>
    new Intl.NumberFormat(currentCurrency.locale, {
      style: 'currency',
      currency: currentCurrency.code
    }).format(val || 0)

  return (
    <div className="document-form" id="document-form">
      {/* Header Details */}
      <section className="form-section glass-card">
        <h2 className="section-title"><i className="fas fa-undo"></i> Credit Note Details</h2>
        <div className="form-grid cols-3">
          <div className="form-group">
            <label>Document Title</label>
            <input type="text" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.title} onChange={e => onChange('title', e.target.value)}
              placeholder="CREDIT NOTE" />
          </div>
          <div className="form-group">
            <label>Credit Note Number</label>
            <input type="text" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.doc_number} onChange={e => onChange('doc_number', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Credit Note Date</label>
            <input type="date" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.date} onChange={e => onChange('date', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Currency</label>
            <select value={formData.currency || 'INR'} onChange={e => onChange('currency', e.target.value)} className="form-input">
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="AED">AED (د.إ)</option>
            </select>
          </div>
        </div>
        <div className="form-grid cols-2" style={{ marginTop: '8px' }}>
          <div className="form-group">
            <label>Related Invoice No.</label>
            <input type="text" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.related_invoice_number} onChange={e => onChange('related_invoice_number', e.target.value)}
              placeholder="e.g. INV-1001" />
          </div>
          <div className="form-group">
            <label>Related Invoice Date</label>
            <input type="date" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.related_invoice_date || ''} onChange={e => onChange('related_invoice_date', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Place of Supply</label>
            <input type="text" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.place_of_supply || ''} onChange={e => onChange('place_of_supply', e.target.value)}
              placeholder="e.g. Maharashtra (27)" />
          </div>
          <div className="form-group">
            <label>Theme Color</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="color" className="form-input" style={{ padding: '2px', height: '38px', width: '60px' }}
                value={formData.themeColor || '#800000'} onChange={e => onChange('themeColor', e.target.value)} />
              <span style={{ fontSize: '0.8rem', color: '#666' }}>{formData.themeColor}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Seller (From) Details */}
      <section className="form-section glass-card">
        <h2 className="section-title"><i className="fas fa-store"></i> Seller (From)</h2>
        <div className="form-grid cols-2">
          <div className="form-group full-width">
            <label>Company / Name</label>
            <input type="text" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.sender_name} onChange={e => onChange('sender_name', e.target.value)}
              placeholder="Your Company Name" />
          </div>
          <div className="form-group full-width">
            <label>Address</label>
            <textarea className="form-input" rows="2"
              onFocus={() => onFocusSection('header')}
              value={formData.sender_address} onChange={e => onChange('sender_address', e.target.value)}
              placeholder="123 Business St, City, State - PIN" />
          </div>
          <div className="form-group">
            <label>Tagline</label>
            <input type="text" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.tagline || ''} onChange={e => onChange('tagline', e.target.value)}
              placeholder="e.g. Your Partner in Growth" />
          </div>
          <div className="form-group">
            <label>Website</label>
            <input type="text" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.website} onChange={e => onChange('website', e.target.value)}
              placeholder="www.yourcompany.com" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.sender_email} onChange={e => onChange('sender_email', e.target.value)}
              placeholder="you@company.com" />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="tel" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.sender_phone} onChange={e => onChange('sender_phone', e.target.value)}
              placeholder="+91 00000 00000" />
          </div>
          {!!user?.org_gst_registered ? (
            <div className="form-group full-width">
              <label>GSTIN</label>
              <input type="text" className="form-input"
                onFocus={() => onFocusSection('header')}
                value={formData.sender_gstin || ''} onChange={e => onChange('sender_gstin', e.target.value)}
                placeholder="GSTIN (optional)" maxLength={15} />
            </div>
          ) : null}
        </div>
      </section>

      {/* Customer Details */}
      <section className="form-section glass-card">
        <h2 className="section-title"><i className="fas fa-user"></i> Customer (To)</h2>
        <div className="form-grid cols-2">
          <div className="form-group full-width">
            <label>Customer Name</label>
            <input type="text" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.client_name} onChange={e => onChange('client_name', e.target.value)} />
          </div>
          <div className="form-group full-width">
            <label>Customer Address</label>
            <textarea className="form-input" rows="2"
              onFocus={() => onFocusSection('header')}
              value={formData.client_address} onChange={e => onChange('client_address', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Customer GSTIN</label>
            <input type="text" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.client_gstin} onChange={e => onChange('client_gstin', e.target.value)} />
          </div>
          <div className="form-group">
            <label>State Code</label>
            <input type="text" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.client_state_code} onChange={e => onChange('client_state_code', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Contact Phone</label>
            <input type="tel" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.client_phone} onChange={e => onChange('client_phone', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.client_email} onChange={e => onChange('client_email', e.target.value)} />
          </div>
        </div>
      </section>

      {/* Adjustment Info */}
      <section className="form-section glass-card">
        <h2 className="section-title"><i className="fas fa-info-circle"></i> Adjustment Info</h2>
        <div className="form-grid cols-2">
          <div className="form-group">
            <label>Reason for Credit</label>
            <input type="text" className="form-input"
              onFocus={() => onFocusSection('items')}
              value={formData.reason_for_credit} onChange={e => onChange('reason_for_credit', e.target.value)}
              placeholder="e.g. Returned damaged products" />
          </div>
          <div className="form-group">
            <label>Reference</label>
            <input type="text" className="form-input"
              onFocus={() => onFocusSection('items')}
              value={formData.reference} onChange={e => onChange('reference', e.target.value)}
              placeholder="e.g. Goods return as per discussion" />
          </div>
        </div>
      </section>

      {/* Line Items */}
      <section className="form-section glass-card">
        <div className="section-header-row">
          <h2 className="section-title"><i className="fas fa-list"></i> Returned Items</h2>
          <button className="btn btn-sm btn-add" onClick={onAddItem}>
            <i className="fas fa-plus"></i> Add Item
          </button>
        </div>
        <div className="items-list">
          {formData.items.map((item, index) => (
            <div key={index} className="item-card">
              <div className="item-row-top">
                <div className={`form-group ${user?.org_gst_registered ? 'item-desc-wide' : 'item-desc-full'}`}>
                  <label>DESCRIPTION</label>
                  <textarea className="form-input" rows="1"
                    value={item.description}
                    onFocus={() => onFocusSection('items')}
                    onChange={e => onItemChange(index, 'description', e.target.value)}
                    placeholder="Item / service description" />
                </div>
                {!!user?.org_gst_registered ? (
                  <div className="form-group item-hsn-compact">
                    <label>HSN/SAC</label>
                    <input type="text" className="form-input"
                      value={item.hsn || ''}
                      onChange={e => onItemChange(index, 'hsn', e.target.value)}
                      placeholder="e.g. 9983" />
                  </div>
                ) : null}
                {formData.items.length > 1 ? (
                  <button className="btn-icon btn-remove item-delete" onClick={() => onRemoveItem(index)}
                    title="Remove item">
                    <i className="fas fa-times"></i>
                  </button>
                ) : null}
              </div>
              <div className="item-row-bottom">
                <div className="form-group" style={{ flex: '0.8' }}>
                  <label>Qty Returned</label>
                  <input type="text" className="form-input"
                    value={item.quantity}
                    onFocus={() => onFocusSection('items')}
                    onChange={e => onItemChange(index, 'quantity', e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: '1' }}>
                  <label>UNIT PRICE</label>
                  <div className="input-with-symbol">
                    <span className="symbol">{currentCurrency.symbol}</span>
                    <input type="text" className="form-input"
                      value={item.unit_price}
                      onFocus={() => onFocusSection('items')}
                      onChange={e => onItemChange(index, 'unit_price', e.target.value)}
                      placeholder="0.00" />
                  </div>
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

      {/* Tax & Additional Charges */}
      <section className="form-section glass-card">
        <div className="section-header-row">
          <h2 className="section-title"><i className="fas fa-plus-circle"></i> Additional Charges</h2>
          <button className="btn btn-sm btn-ghost" onClick={onAddCharge} onFocus={() => onFocusSection('totals')}>
            <i className="fas fa-plus"></i> Add Charge
          </button>
        </div>
        <div className="additional-charges-list">
          {(formData.additional_charges || []).map((charge, index) => (
            <div key={index} className="charge-row">
              <input type="text" className="form-input" placeholder="Charge label"
                onFocus={() => onFocusSection('totals')}
                value={charge.label} onChange={e => onChargeChange(index, 'label', e.target.value)} />
              <div className="input-with-symbol">
                <span className="symbol">{currentCurrency.symbol}</span>
                <input type="text" className="form-input" placeholder="Amount"
                  value={charge.amount}
                  onFocus={() => onFocusSection('totals')}
                  onChange={e => onChargeChange(index, 'amount', e.target.value)} />
              </div>
              <button className="btn-icon btn-remove" onClick={() => onRemoveCharge(index)}>
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}
        </div>

        <div className="form-group" style={{ marginTop: '20px' }}>
          <label>{user?.org_gst_registered ? 'GST Rate (%)' : 'Tax Rate (%)'}</label>
          <select className="form-input"
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
                <option value="12">12%</option>
                <option value="18">18%</option>
              </>
            )}
          </select>
        </div>
      </section>

      {/* Totals */}
      <section className="form-section glass-card">
        <h2 className="section-title"><i className="fas fa-calculator"></i> Totals</h2>
        <div className="totals-summary">
          <div className="total-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
          {formData.tax_rate > 0 ? (
            user?.org_gst_registered ? (
              <>
                <div className="total-row"><span>CGST ({formData.tax_rate / 2}%) Reversal</span><span>{fmt(taxAmount / 2)}</span></div>
                <div className="total-row"><span>SGST ({formData.tax_rate / 2}%) Reversal</span><span>{fmt(taxAmount / 2)}</span></div>
              </>
            ) : (
              <div className="total-row"><span>Tax ({formData.tax_rate}%)</span><span>{fmt(taxAmount)}</span></div>
            )
          ) : null}
          {(formData.additional_charges || []).filter(c => (parseFloat(c.amount) || 0) !== 0).map((c, i) => (
            <div key={i} className="total-row">
              <span>{c.label || 'Extra Charge'}</span>
              <span>{fmt(c.amount)}</span>
            </div>
          ))}
          <div className="total-row total-final"><span>Total Credit</span><span>{fmt(total)}</span></div>
        </div>
      </section>

      {/* Notes & Bank Details */}
      <section className="form-section glass-card">
        <div className="form-group">
          <label>Notes</label>
          <textarea className="form-input" rows="2"
            onFocus={() => onFocusSection('footer')}
            value={formData.notes || ''} onChange={e => onChange('notes', e.target.value)}
            placeholder="The above amount will be adjusted..." />
        </div>
        <div className="form-group" style={{ marginTop: '15px' }}>
          <h2 className="section-title" style={{ fontSize: '1rem', marginBottom: '10px' }}><i className="fas fa-university"></i> Bank Details (for Refund)</h2>
          <div className="form-grid cols-2">
            <div className="form-group">
              <label>Bank Name</label>
              <input type="text" className="form-input"
                onFocus={() => onFocusSection('bank')}
                value={formData.bank_name || ''} onChange={e => onChange('bank_name', e.target.value)} />
            </div>
            <div className="form-group">
              <label>A/C Number</label>
              <input type="text" className="form-input"
                onFocus={() => onFocusSection('bank')}
                value={formData.bank_account || ''} onChange={e => onChange('bank_account', e.target.value)} />
            </div>
            <div className="form-group">
              <label>IFSC Code</label>
              <input type="text" className="form-input"
                onFocus={() => onFocusSection('bank')}
                value={formData.bank_ifsc || ''} onChange={e => onChange('bank_ifsc', e.target.value)} />
            </div>
            <div className="form-group">
              <label>UPI ID</label>
              <input type="text" className="form-input"
                onFocus={() => onFocusSection('bank')}
                value={formData.upi_id || ''} onChange={e => onChange('upi_id', e.target.value)} />
            </div>
          </div>
        </div>
      </section>



      {/* Terms */}
      <section className="form-section glass-card full-width">
        <h2 className="section-title"><i className="fas fa-sticky-note"></i> Terms & Conditions</h2>
        <textarea className="form-input" rows="3"
          onFocus={() => onFocusSection('footer')}
          value={formData.terms} onChange={e => onChange('terms', e.target.value)} />
      </section>
    </div>
  )
}
