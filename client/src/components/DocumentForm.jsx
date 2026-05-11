export default function DocumentForm({
  user, formData, onChange, onItemChange, onAddItem, onRemoveItem,
  onAddCharge, onRemoveCharge, onChargeChange, onFocusSection,
  subtotal, taxAmount, total
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
        <h2 className="section-title"><i className="fas fa-heading"></i> Header Details</h2>
        <div className="form-grid cols-3">
          <div className="form-group">
            <label htmlFor="input-title">Document Title</label>
            <input id="input-title" type="text" className="form-input"
              value={formData.title} onChange={e => onChange('title', e.target.value)}
              onFocus={() => onFocusSection('header')}
              placeholder="INVOICE" />
          </div>
          <div className="form-group">
            <label htmlFor="input-currency">Currency</label>
            <select id="input-currency" value={formData.currency || 'INR'}
              onChange={e => onChange('currency', e.target.value)} className="form-input">
              <option value="INR">INR (₹) - Indian Rupee</option>
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
              <option value="AED">AED (د.إ) - UAE Dirham</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="input-theme">Theme Color</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input id="input-theme" type="color" className="form-input" style={{ padding: '2px', height: '38px', width: '60px' }}
                value={formData.themeColor || '#0055d4'} onChange={e => onChange('themeColor', e.target.value)} />
              <span style={{ fontSize: '0.8rem', color: '#666' }}>{formData.themeColor}</span>
            </div>
          </div>
        </div>

        <div className="form-grid cols-2" style={{ marginTop: '15px' }}>
          <div className="form-group">
            <label htmlFor="input-doc-number">Document Number</label>
            <input id="input-doc-number" type="text" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.doc_number} onChange={e => onChange('doc_number', e.target.value)}
              placeholder="INV-0001" />
          </div>
          <div className="form-group">
            <label htmlFor="input-date">Invoice Date</label>
            <input id="input-date" type="date" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.date} onChange={e => onChange('date', e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="input-due-date">Due Date <span className="label-hint">(auto from terms)</span></label>
            <input id="input-due-date" type="date" className="form-input input-readonly"
              value={formData.due_date} readOnly />
          </div>
          {formData.title === 'PURCHASE ORDER' && (
            <div className="form-group">
              <label htmlFor="input-delivery-date">Expected Delivery Date</label>
              <input id="input-delivery-date" type="date" className="form-input"
                value={formData.expected_delivery_date || ''} onChange={e => onChange('expected_delivery_date', e.target.value)} />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="input-terms-type">Payment Terms</label>
            <select id="input-terms-type" className="form-input"
              value={formData.payment_terms || 'Net 15 Days'}
              onChange={e => onChange('payment_terms', e.target.value)}>
              <option>Net 15 Days</option>
              <option>Net 30 Days</option>
              <option>Net 45 Days</option>
              <option>Net 60 Days</option>
              <option>Due on Receipt</option>
              <option>No Due</option>
            </select>
          </div>
          {formData.title === 'CREDIT NOTE' && (
            <>
              <div className="form-group">
                <label htmlFor="input-rel-inv">Related Invoice No.</label>
                <input id="input-rel-inv" type="text" className="form-input"
                  value={formData.related_invoice_number || ''} onChange={e => onChange('related_invoice_number', e.target.value)}
                  placeholder="e.g. INV-1001" />
              </div>
              <div className="form-group">
                <label htmlFor="input-rel-date">Related Invoice Date</label>
                <input id="input-rel-date" type="date" className="form-input"
                  value={formData.related_invoice_date || ''} onChange={e => onChange('related_invoice_date', e.target.value)} />
              </div>
            </>
          )}
        </div>
      </section>

      {/* Sender Details */}
      <section className="form-section glass-card">
        <h2 className="section-title"><i className="fas fa-building"></i> From (Sender)</h2>
        <div className="form-grid cols-2">
          <div className="form-group full-width">
            <label htmlFor="input-sender-name">Company / Name</label>
            <input id="input-sender-name" type="text" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.sender_name} onChange={e => onChange('sender_name', e.target.value)}
              placeholder="Your Company Name" />
          </div>
          <div className="form-group full-width">
            <label htmlFor="input-sender-address">Address</label>
            <textarea id="input-sender-address" className="form-input" rows="2"
              onFocus={() => onFocusSection('header')}
              value={formData.sender_address} onChange={e => onChange('sender_address', e.target.value)}
              placeholder="123 Business St, City, State - PIN" />
          </div>
          <div className="form-group">
            <label htmlFor="input-sender-tagline">Tagline</label>
            <input id="input-sender-tagline" type="text" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.tagline || ''} onChange={e => onChange('tagline', e.target.value)}
              placeholder="e.g. Your Partner in Growth" />
          </div>
          <div className="form-group">
            <label htmlFor="input-sender-website">Website</label>
            <input id="input-sender-website" type="text" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.website} onChange={e => onChange('website', e.target.value)}
              placeholder="www.yourcompany.com" />
          </div>
          <div className="form-group">
            <label htmlFor="input-sender-email">Email</label>
            <input id="input-sender-email" type="email" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.sender_email} onChange={e => onChange('sender_email', e.target.value)}
              placeholder="you@company.com" />
          </div>
          <div className="form-group">
            <label htmlFor="input-sender-phone">Phone</label>
            <input id="input-sender-phone" type="tel" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.sender_phone} onChange={e => onChange('sender_phone', e.target.value)}
              placeholder="+91 00000 00000" />
          </div>
          {!!user?.org_gst_registered ? (
            <div className="form-group full-width">
              <label htmlFor="input-sender-gstin">GSTIN</label>
              <input id="input-sender-gstin" type="text" className="form-input"
                onFocus={() => onFocusSection('header')}
                value={formData.sender_gstin || ''} onChange={e => onChange('sender_gstin', e.target.value)}
                placeholder="GSTIN (optional)" maxLength={15} />
            </div>
          ) : null}
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
              onFocus={() => onFocusSection('header')}
              placeholder="Client/Company Name" />
          </div>
          <div className="form-group full-width">
            <label htmlFor="input-client-address">Address</label>
            <textarea id="input-client-address" className="form-input" rows="2"
              onFocus={() => onFocusSection('header')}
              value={formData.client_address} onChange={e => onChange('client_address', e.target.value)}
              placeholder="Client address" />
          </div>
          <div className="form-group">
            <label htmlFor="input-client-email">Email</label>
            <input id="input-client-email" type="email" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.client_email} onChange={e => onChange('client_email', e.target.value)}
              placeholder="client@company.com" />
          </div>
          <div className="form-group">
            <label htmlFor="input-client-phone">Phone</label>
            <input id="input-client-phone" type="tel" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.client_phone} onChange={e => onChange('client_phone', e.target.value)}
              placeholder="+91 12345 67890" />
          </div>
          <div className="form-group">
            <label htmlFor="input-client-state">State Code</label>
            <input id="input-client-state" type="text" className="form-input"
              onFocus={() => onFocusSection('header')}
              value={formData.client_state_code} onChange={e => onChange('client_state_code', e.target.value)}
              placeholder="e.g. 27" />
          </div>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', height: '38px' }}>
              <label style={{ margin: 0, fontWeight: '700', fontSize: '0.85rem' }}>Ship to a different address?</label>
              <input type="checkbox" checked={formData.different_shipping}
                onChange={e => onChange('different_shipping', e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
            </div>
          </div>
          {!!user?.org_gst_registered ? (
            <div className="form-group full-width">
              <label htmlFor="input-client-gstin">Client GSTIN</label>
              <input id="input-client-gstin" type="text" className="form-input"
                onFocus={() => onFocusSection('header')}
                value={formData.client_gstin || ''} onChange={e => onChange('client_gstin', e.target.value)}
                placeholder="Client GSTIN (optional)" maxLength={15} />
            </div>
          ) : null}
        </div>
      </section>

      {formData.title === 'CREDIT NOTE' && (
        <section className="form-section glass-card">
          <h2 className="section-title"><i className="fas fa-info-circle"></i> Credit Info</h2>
          <div className="form-grid cols-2">
            <div className="form-group">
              <label htmlFor="input-reason">Reason for Credit</label>
              <input id="input-reason" type="text" className="form-input"
                value={formData.reason_for_credit || ''} onChange={e => onChange('reason_for_credit', e.target.value)}
                placeholder="e.g. Returned damaged products" />
            </div>
            <div className="form-group">
              <label htmlFor="input-reference">Reference</label>
              <input id="input-reference" type="text" className="form-input"
                value={formData.reference || ''} onChange={e => onChange('reference', e.target.value)}
                placeholder="e.g. Goods return as per discussion" />
            </div>
          </div>
        </section>
      )}
      {formData.different_shipping && (
        <section className="form-section glass-card">
          <h2 className="section-title"><i className="fas fa-truck"></i> Ship To</h2>
          <div className="form-grid cols-2">
            <div className="form-group full-width">
              <label htmlFor="input-shipping-name">Shipping Name</label>
              <input id="input-shipping-name" type="text" className="form-input"
                onFocus={() => onFocusSection('header')}
                value={formData.shipping_name} onChange={e => onChange('shipping_name', e.target.value)}
                placeholder="Shipping Recipient Name" />
            </div>
            <div className="form-group full-width">
              <label htmlFor="input-shipping-address">Address</label>
              <textarea id="input-shipping-address" className="form-input" rows="2"
                onFocus={() => onFocusSection('header')}
                value={formData.shipping_address} onChange={e => onChange('shipping_address', e.target.value)}
                placeholder="Shipping address" />
            </div>
            <div className="form-group">
              <label htmlFor="input-shipping-phone">Shipping Phone</label>
              <input id="input-shipping-phone" type="text" className="form-input"
                value={formData.shipping_phone || ''} onChange={e => onChange('shipping_phone', e.target.value)}
                placeholder="Shipping Phone No." />
            </div>
            <div className="form-group">
              <label htmlFor="input-shipping-gstin">Shipping GSTIN</label>
              <input id="input-shipping-gstin" type="text" className="form-input"
                onFocus={() => onFocusSection('header')}
                value={formData.shipping_gstin} onChange={e => onChange('shipping_gstin', e.target.value)}
                placeholder="Shipping GSTIN (optional)" maxLength={15} />
            </div>
            <div className="form-group">
              <label htmlFor="input-shipping-state">State Code</label>
              <input id="input-shipping-state" type="text" className="form-input"
                value={formData.shipping_state_code} onChange={e => onChange('shipping_state_code', e.target.value)}
                placeholder="e.g. 27" />
            </div>
          </div>
        </section>
      )}

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
                      placeholder="e.g. 9983" id={`item-hsn-${index}`} />
                  </div>
                ) : null}
                {formData.items.length > 1 ? (
                  <button className="btn-icon btn-remove item-delete" onClick={() => onRemoveItem(index)}
                    title="Remove item" id={`btn-remove-${index}`}>
                    <i className="fas fa-times"></i>
                  </button>
                ) : null}
              </div>
              {/* Row 2: Qty + Rate + Amount */}
              <div className="item-row-bottom">
                <div className="form-group" style={{ flex: '0.8' }}>
                  <label>Qty</label>
                  <input type="text" className="form-input"
                    value={item.quantity}
                    onFocus={() => onFocusSection('items')}
                    onChange={e => onItemChange(index, 'quantity', e.target.value)}
                    id={`item-qty-${index}`} />
                </div>
                <div className="form-group" style={{ flex: '0.8' }}>
                  <label>Unit / UOM</label>
                  <input list="uom-options" className="form-input"
                    onFocus={() => onFocusSection('items')}
                    value={item.unit || ''}
                    onChange={e => onItemChange(index, 'unit', e.target.value)}
                    placeholder="e.g. PCS" />
                  <datalist id="uom-options">
                    <option value="PCS (PIECES)" />
                    <option value="NOS (NUMBERS)" />
                    <option value="UNIT (UNITS)" />
                    <option value="KG (KILOGRAMS)" />
                    <option value="GMS (GRAMMES)" />
                    <option value="MTS (METRIC TON)" />
                    <option value="QTL (QUINTAL)" />
                    <option value="LTR (LITRE)" />
                    <option value="MLT (MILILITRE)" />
                    <option value="BOX (BOX)" />
                    <option value="CTN (CARTONS)" />
                    <option value="BAG (BAGS)" />
                    <option value="PAC (PACKS)" />
                    <option value="BTL (BOTTLES)" />
                    <option value="ROL (ROLLS)" />
                    <option value="SET (SETS)" />
                    <option value="DOZ (DOZENS)" />
                    <option value="BUN (BUNCHES)" />
                    <option value="BDL (BUNDLES)" />
                    <option value="CAN (CANS)" />
                    <option value="DRM (DRUMS)" />
                    <option value="TUB (TUBES)" />
                    <option value="MTR (METERS)" />
                    <option value="CMS (CENTIMETERS)" />
                    <option value="SQF (SQUARE FEET)" />
                    <option value="SQM (SQUARE METERS)" />
                    <option value="SQY (SQUARE YARDS)" />
                    <option value="YDS (YARDS)" />
                    <option value="TBS (TABLETS)" />
                    <option value="THD (THOUSANDS)" />
                    <option value="OTH (OTHERS)" />
                  </datalist>
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
                    onChange={e => onItemChange(index, 'discount', e.target.value)}
                    id={`item-discount-${index}`} />
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

      {/* Totals & Notes */}

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
                  <option value="12">12%</option>
                  <option value="18">18%</option>
                </>
              )}
            </select>
          </div>
          {!user?.org_gst_registered ? (
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              <label style={{ margin: 0 }}>Show Tax on Invoice?</label>
              <input type="checkbox" checked={formData.show_tax_field}
                onChange={e => onChange('show_tax_field', e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
            </div>
          ) : null}
          <div className="form-group" style={{ marginTop: '10px' }}>
            <label htmlFor="input-discount">Discount (%)</label>
            <input id="input-discount" type="text" className="form-input"
              value={formData.discount || 0}
              onFocus={() => onFocusSection('totals')}
              onChange={e => onChange('discount', e.target.value)} />
          </div>
        </section>

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
                  <div className="total-row"><span>CGST ({formData.tax_rate / 2}%)</span><span>{fmt((subtotal - (subtotal * (formData.discount || 0) / 100)) * formData.tax_rate / 200)}</span></div>
                  <div className="total-row"><span>SGST ({formData.tax_rate / 2}%)</span><span>{fmt((subtotal - (subtotal * (formData.discount || 0) / 100)) * formData.tax_rate / 200)}</span></div>
                </>
              ) : (
                formData.show_tax_field ? <div className="total-row"><span>Tax ({formData.tax_rate}%)</span><span>{fmt((subtotal - (subtotal * (formData.discount || 0) / 100)) * formData.tax_rate / 100)}</span></div> : null
              )
            ) : null}

            {(formData.additional_charges || []).filter(c => (parseFloat(c.amount) || 0) !== 0).map((c, i) => (
              <div key={i} className="total-row">
                <span>{c.label || 'Extra Charge'}</span>
                <span>{fmt(c.amount)}</span>
              </div>
            ))}

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
              onFocus={() => onFocusSection('bank')}
              value={formData.bank_name || ''} onChange={e => onChange('bank_name', e.target.value)}
              placeholder="e.g. State Bank of India" />
          </div>
          <div className="form-group">
            <label htmlFor="input-bank-account">Account Number</label>
            <input id="input-bank-account" type="text" className="form-input"
              onFocus={() => onFocusSection('bank')}
              value={formData.bank_account || ''} onChange={e => onChange('bank_account', e.target.value)}
              placeholder="XXXX XXXX XXXX" />
          </div>
          <div className="form-group">
            <label htmlFor="input-bank-ifsc">IFSC Code</label>
            <input id="input-bank-ifsc" type="text" className="form-input"
              onFocus={() => onFocusSection('bank')}
              value={formData.bank_ifsc || ''} onChange={e => onChange('bank_ifsc', e.target.value)}
              placeholder="e.g. SBIN0001234" />
          </div>
          <div className="form-group">
            <label htmlFor="input-bank-upi">UPI ID</label>
            <input id="input-bank-upi" type="text" className="form-input"
              onFocus={() => onFocusSection('bank')}
              value={formData.upi_id || ''} onChange={e => onChange('upi_id', e.target.value)}
              placeholder="e.g. yourcompany@upi" />
          </div>
        </div>
      </section>


      {/* Payment Tracking */}
      <section className="form-section glass-card">
        <h2 className="section-title"><i className="fas fa-credit-card"></i> Payment Status</h2>
        <div className="form-grid cols-2">
          <div className="form-group">
            <label htmlFor="input-payment-status">Status</label>
            <select id="input-payment-status" className="form-input"
              value={formData.payment_status}
              onChange={e => onChange('payment_status', e.target.value)}>
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          {formData.payment_status === 'paid' ? (
            <>
              <div className="form-group">
                <label htmlFor="input-payment-method">Payment Method</label>
                <select id="input-payment-method" className="form-input"
                  value={formData.payment_method} onChange={e => onChange('payment_method', e.target.value)}>
                  <option value="">Select Method</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Online">Online (UPI/Card)</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              {formData.payment_method === 'Online' ? (
                <div className="form-group">
                  <label htmlFor="input-tx-id">Transaction ID</label>
                  <input id="input-tx-id" type="text" className="form-input"
                    value={formData.transaction_id} onChange={e => onChange('transaction_id', e.target.value)}
                    placeholder="Enter TXN ID or Ref No." />
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </section>

      {/* Notes & Terms */}
      <section className="form-section glass-card full-width">
        <h2 className="section-title"><i className="fas fa-sticky-note"></i> Notes &amp; Terms</h2>
        <div className="form-grid cols-2">
          <div className="form-group">
            <label htmlFor="input-notes">Notes</label>
            <textarea id="input-notes" className="form-input" rows="3"
              onFocus={() => onFocusSection('footer')}
              value={formData.notes || ''} onChange={e => onChange('notes', e.target.value)}
              placeholder="Any additional notes or internal reminders..." />
          </div>
          <div className="form-group">
            <label htmlFor="input-terms">Terms & Conditions</label>
            <textarea id="input-terms" className="form-input" rows="3"
              onFocus={() => onFocusSection('footer')}
              value={formData.terms} onChange={e => onChange('terms', e.target.value)}
              placeholder="Standard terms and conditions..." />
          </div>
        </div>
      </section>
    </div>
  )
}
