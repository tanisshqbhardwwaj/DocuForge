export default function POForm({
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
      {/* PO Header */}
      <section className="form-section glass-card">
        <h2 className="section-title"><i className="fas fa-shopping-cart"></i> PO Details</h2>
        <div className="form-grid cols-3">
          <div className="form-group">
            <label>Document Title</label>
            <input type="text" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.title} onChange={e => onChange('title', e.target.value)}
              placeholder="PURCHASE ORDER" />
          </div>
          <div className="form-group">
            <label>PO Number</label>
            <input type="text" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.doc_number} onChange={e => onChange('doc_number', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Order Date</label>
            <input type="date" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.date} onChange={e => onChange('date', e.target.value)} />
          </div>
        </div>
        <div className="form-grid cols-3" style={{ marginTop: '8px' }}>
          <div className="form-group">
            <label>Expected Delivery</label>
            <input type="date" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.expected_delivery_date} onChange={e => onChange('expected_delivery_date', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Payment Terms</label>
            <select className="form-input"
              value={formData.payment_terms || 'Net 30 Days'}
              onChange={e => onChange('payment_terms', e.target.value)}>
              <option>Net 15 Days</option>
              <option>Net 30 Days</option>
              <option>Net 45 Days</option>
              <option>Net 60 Days</option>
              <option>Due on Receipt</option>
            </select>
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
        <div className="form-grid cols-1" style={{ marginTop: '8px' }}>
          <div className="form-group">
            <label>Theme Color</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="color" className="form-input" style={{ padding: '2px', height: '38px', width: '60px' }}
                value={formData.themeColor || '#003366'} onChange={e => onChange('themeColor', e.target.value)} />
              <span style={{ fontSize: '0.8rem', color: '#666' }}>{formData.themeColor}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Buyer (Your Company) */}
      <section className="form-section glass-card">
        <h2 className="section-title"><i className="fas fa-building"></i> Buyer (Your Company)</h2>
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
              value={formData.tagline || ''} onChange={e => onChange('tagline', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Website</label>
            <input type="text" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.website} onChange={e => onChange('website', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.sender_email} onChange={e => onChange('sender_email', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="tel" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.sender_phone} onChange={e => onChange('sender_phone', e.target.value)} />
          </div>
          {!!user?.org_gst_registered ? (
            <div className="form-group full-width">
              <label>GSTIN</label>
              <input type="text" className="form-input"
                onFocus={() => onFocusSection('header')}
                value={formData.sender_gstin || ''} onChange={e => onChange('sender_gstin', e.target.value)}
                maxLength={15} />
            </div>
          ) : null}
        </div>
      </section>

      {/* Vendor (Supplier) */}
      <section className="form-section glass-card">
        <h2 className="section-title"><i className="fas fa-truck"></i> Vendor (Supplier)</h2>
        <div className="form-grid cols-2">
          <div className="form-group full-width">
            <label>Vendor Name</label>
            <input type="text" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.client_name} onChange={e => onChange('client_name', e.target.value)} />
          </div>
          <div className="form-group full-width">
            <label>Vendor Address</label>
            <textarea className="form-input" rows="2"
              onFocus={() => onFocusSection('header')}
              value={formData.client_address} onChange={e => onChange('client_address', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Phone</label>
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
          {!!user?.org_gst_registered ? (
            <>
              <div className="form-group">
                <label>Vendor GSTIN</label>
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
            </>
          ) : null}
        </div>
      </section>

      {/* Order Items */}
      <section className="form-section glass-card">
        <div className="section-header-row">
          <h2 className="section-title"><i className="fas fa-list"></i> Order Items</h2>
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
                  <button className="btn-icon btn-remove item-delete" onClick={() => onRemoveItem(index)} title="Remove item">
                    <i className="fas fa-times"></i>
                  </button>
                ) : null}
              </div>
              <div className="item-row-bottom">
                <div className="form-group" style={{ flex: '0.8' }}>
                  <label>Qty</label>
                  <input type="text" className="form-input"
                    value={item.quantity}
                    onFocus={() => onFocusSection('items')}
                    onChange={e => onItemChange(index, 'quantity', e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: '0.8' }}>
                  <label>Unit / UOM</label>
                  <input list="uom-options" className="form-input"
                    onFocus={() => onFocusSection('items')}
                    value={item.unit || ''}
                    onChange={e => onItemChange(index, 'unit', e.target.value)}
                    placeholder="e.g. PCS" />
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
                  <label>Disc (%)</label>
                  <input type="text" className="form-input"
                    value={item.discount || 0}
                    onFocus={() => onFocusSection('items')}
                    onChange={e => onItemChange(index, 'discount', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Amount</label>
                  <div className="amount-display">{fmt((item.quantity * item.unit_price) * (1 - (item.discount || 0) / 100))}</div>
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
        <div className="form-group" style={{ marginTop: '10px' }}>
          <label>Discount (%)</label>
          <input type="text" className="form-input"
            value={formData.discount || 0}
            onFocus={() => onFocusSection('totals')}
            onChange={e => onChange('discount', e.target.value)} />
        </div>
      </section>

      {/* Totals */}
      <section className="form-section glass-card">
        <h2 className="section-title"><i className="fas fa-calculator"></i> Totals</h2>
        <div className="totals-summary">
          <div className="total-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
          {formData.discount > 0 ? (
            <div className="total-row"><span>Discount ({formData.discount}%)</span><span>-{fmt(subtotal * formData.discount / 100)}</span></div>
          ) : null}
          {formData.tax_rate > 0 ? (
            user?.org_gst_registered ? (
              <>
                <div className="total-row"><span>CGST ({formData.tax_rate / 2}%)</span><span>{fmt(taxAmount / 2)}</span></div>
                <div className="total-row"><span>SGST ({formData.tax_rate / 2}%)</span><span>{fmt(taxAmount / 2)}</span></div>
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
          <div className="total-row total-final"><span>Grand Total</span><span>{fmt(total)}</span></div>
        </div>
      </section>

      {/* Notes */}
      <section className="form-section glass-card full-width">
        <h2 className="section-title"><i className="fas fa-sticky-note"></i> Notes &amp; Terms</h2>
        <div className="form-grid cols-2">
          <div className="form-group">
            <label>Notes</label>
            <textarea className="form-input" rows="3"
              onFocus={() => onFocusSection('footer')}
              value={formData.notes || ''} onChange={e => onChange('notes', e.target.value)}
              placeholder="Any additional notes for the vendor..." />
          </div>
          <div className="form-group">
            <label>Terms & Conditions</label>
            <textarea className="form-input" rows="3"
              onFocus={() => onFocusSection('footer')}
              value={formData.terms} onChange={e => onChange('terms', e.target.value)} />
          </div>
        </div>
      </section>
    </div>
  )
}
