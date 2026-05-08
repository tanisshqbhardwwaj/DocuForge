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
              {!!user?.org_gst_registered ? <option value="TAX INVOICE">TAX INVOICE</option> : null}
              <option value="INVOICE">INVOICE</option>
              <option value="PURCHASE ORDER">PURCHASE ORDER</option>
              <option value="CREDIT NOTE">CREDIT NOTE</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="input-doc-number">{formData.title === 'PURCHASE ORDER' ? 'PO Number' : 'Invoice Number'}</label>
            <input id="input-doc-number" type="text" className="form-input"
              value={formData.doc_number} onChange={e => onChange('doc_number', e.target.value)}
              placeholder={formData.title === 'PURCHASE ORDER' ? 'PO-2024-001' : 'INV-0001'} />
          </div>
          <div className="form-group">
            <label htmlFor="input-date">{formData.title === 'PURCHASE ORDER' ? 'PO Date' : 'Invoice Date'}</label>
            <input id="input-date" type="date" className="form-input"
              value={formData.date} onChange={e => onChange('date', e.target.value)} />
          </div>
          {formData.title !== 'PURCHASE ORDER' && (
            <div className="form-group">
              <label htmlFor="input-due-date">Due Date <span className="label-hint">(auto from terms)</span></label>
              <input id="input-due-date" type="date" className="form-input input-readonly"
                value={formData.due_date} readOnly />
            </div>
          )}
          {!!user?.org_gst_registered && formData.title !== 'PURCHASE ORDER' ? (
            <div className="form-group">
              <label htmlFor="input-place">Place of Supply</label>
              <input id="input-place" type="text" className="form-input"
                value={formData.place_of_supply || ''} onChange={e => onChange('place_of_supply', e.target.value)}
                placeholder="e.g. Tamil Nadu" />
            </div>
          ) : null}
          {formData.title === 'PURCHASE ORDER' && (
            <>
              <div className="form-group">
                <label htmlFor="input-requisitioner">Requisitioner</label>
                <input id="input-requisitioner" type="text" className="form-input"
                  value={formData.sales_person || ''} onChange={e => onChange('sales_person', e.target.value)}
                  placeholder="Person who requested order" />
              </div>
              <div className="form-group">
                <label htmlFor="input-ship-via">Ship Via</label>
                <input id="input-ship-via" type="text" className="form-input"
                  value={formData.transport_mode || ''} onChange={e => onChange('transport_mode', e.target.value)}
                  placeholder="e.g. UPS / Fedex" />
              </div>
            </>
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
              <option>No Due</option>
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
          {!!user?.org_gst_registered ? (
            <>
              <div className="form-group">
                <label htmlFor="input-sender-gstin">GSTIN</label>
                <input id="input-sender-gstin" type="text" className="form-input"
                  value={formData.sender_gstin || ''} onChange={e => onChange('sender_gstin', e.target.value)}
                  placeholder="22AAAAA0000A1Z5" maxLength={15} />
              </div>
              <div className="form-group">
                <label htmlFor="input-sender-state">State & State Code</label>
                <input id="input-sender-state" type="text" className="form-input"
                  value={formData.sender_state || ''} onChange={e => onChange('sender_state', e.target.value)}
                  placeholder="e.g. Tamil Nadu (33)" />
              </div>
              <div className="form-group">
                <label htmlFor="input-sender-pan">PAN Number</label>
                <input id="input-sender-pan" type="text" className="form-input"
                  value={formData.sender_pan || ''} onChange={e => onChange('sender_pan', e.target.value)}
                  placeholder="ABCDE1234F" />
              </div>
            </>
          ) : null}
        </div>
      </section>

      {/* Client Details */}
      <section className="form-section glass-card">
        <h2 className="section-title">
          <i className="fas fa-user"></i> {
            formData.title === 'PURCHASE ORDER' ? 'Bill From (Vendor)' : 'Bill To (Client)'
          }
        </h2>
        <div className="form-grid cols-2">
          <div className="form-group full-width">
            <label htmlFor="input-client-name">
              {formData.title === 'PURCHASE ORDER' ? 'Vendor Name' : 'Client Name'}
            </label>
            <input id="input-client-name" type="text" className="form-input"
              value={formData.client_name} onChange={e => onChange('client_name', e.target.value)}
              placeholder={formData.title === 'PURCHASE ORDER' ? 'Vendor Company Name' : 'Client Company Name'} />
          </div>
          <div className="form-group full-width">
            <label htmlFor="input-client-address">Address</label>
            <textarea id="input-client-address" className="form-input" rows="2"
              value={formData.client_address} onChange={e => onChange('client_address', e.target.value)}
              placeholder={formData.title === 'PURCHASE ORDER' ? 'Vendor address' : 'Client address'} />
          </div>
          <div className="form-group">
            <label htmlFor="input-client-email">Email</label>
            <input id="input-client-email" type="email" className="form-input"
              value={formData.client_email} onChange={e => onChange('client_email', e.target.value)}
              placeholder={formData.title === 'PURCHASE ORDER' ? 'vendor@company.com' : 'client@company.com'} />
          </div>
          <div className="form-group">
            <label htmlFor="input-client-phone">Phone</label>
            <input id="input-client-phone" type="tel" className="form-input"
              value={formData.client_phone} onChange={e => onChange('client_phone', e.target.value)}
              placeholder={formData.title === 'PURCHASE ORDER' ? 'Vendor phone number' : '+91 12345 67890'} />
          </div>
          {formData.title === 'PURCHASE ORDER' && (
            <div className="form-group full-width" style={{ marginTop: '10px' }}>
              <label className="checkbox-container">
                <input type="checkbox" checked={formData.use_diff_ship_to || false}
                  onChange={e => onChange('use_diff_ship_to', e.target.checked)} />
                <span className="checkbox-label">Ship to a different address?</span>
              </label>
            </div>
          )}
          {formData.title === 'PURCHASE ORDER' && formData.use_diff_ship_to && (
            <>
              <div className="form-group full-width">
                <label htmlFor="input-ship-to-name">Shipping Name</label>
                <input id="input-ship-to-name" type="text" className="form-input"
                  value={formData.ship_to_name || ''} onChange={e => onChange('ship_to_name', e.target.value)}
                  placeholder="e.g. Warehouse A" />
              </div>
              <div className="form-group full-width">
                <label htmlFor="input-ship-to-address">Shipping Address</label>
                <textarea id="input-ship-to-address" className="form-input" rows="2"
                  value={formData.ship_to_address || ''} onChange={e => onChange('ship_to_address', e.target.value)}
                  placeholder="Full shipping address..." />
              </div>
              <div className="form-group full-width">
                <label htmlFor="input-ship-to-phone">Shipping Phone Number</label>
                <input id="input-ship-to-phone" type="tel" className="form-input"
                  value={formData.ship_to_phone || ''} onChange={e => onChange('ship_to_phone', e.target.value)}
                  placeholder="+91 12345 67890" />
              </div>
            </>
          )}
          <div className="form-group">
            <label htmlFor="input-client-contact">Contact Person</label>
            <input id="input-client-contact" type="text" className="form-input"
              value={formData.client_contact || ''} onChange={e => onChange('client_contact', e.target.value)}
              placeholder={formData.title === 'PURCHASE ORDER' ? 'Name of vendor contact' : 'Name of person to contact'} />
          </div>
          {formData.title === 'PURCHASE ORDER' && (
            <>
              <div className="form-group">
                <label htmlFor="input-client-gstin">Vendor GSTIN</label>
                <input id="input-client-gstin" type="text" className="form-input"
                  value={formData.client_gstin || ''} onChange={e => onChange('client_gstin', e.target.value)}
                  placeholder="Vendor GSTIN (optional)" maxLength={15} />
              </div>
              <div className="form-group">
                <label htmlFor="input-client-state">Vendor State & Code</label>
                <input id="input-client-state" type="text" className="form-input"
                  value={formData.client_state || ''} onChange={e => onChange('client_state', e.target.value)}
                  placeholder="e.g. Delhi (07)" />
              </div>
              <div className="form-group">
                <label htmlFor="input-client-pan">Vendor PAN Number</label>
                <input id="input-client-pan" type="text" className="form-input"
                  value={formData.client_pan || ''} onChange={e => onChange('client_pan', e.target.value)}
                  placeholder="Vendor PAN (optional)" maxLength={10} />
              </div>
            </>
          )}
          {formData.title !== 'PURCHASE ORDER' && !!user?.org_gst_registered && (
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
                <div className={`form-group ${formData.title === 'PURCHASE ORDER' ? 'item-desc-po' : (user?.org_gst_registered ? 'item-desc-wide' : 'item-desc-full')}`}>
                  <label>Description</label>
                  <input type="text" className="form-input"
                    value={item.description}
                    onChange={e => onItemChange(index, 'description', e.target.value)}
                    placeholder="Item / service description" id={`item-desc-${index}`} />
                </div>
                {formData.title === 'PURCHASE ORDER' ? (
                  <div className="form-group item-code-po">
                    <label>Item Code</label>
                    <input type="text" className="form-input"
                      value={item.hsn || ''}
                      onChange={e => onItemChange(index, 'hsn', e.target.value)}
                      placeholder="SKU-001" id={`item-hsn-${index}`} />
                  </div>
                ) : user?.org_gst_registered ? (
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
              <div className="item-row-bottom">
                <div className="form-group item-qty-box">
                  <label>{formData.title === 'PURCHASE ORDER' ? 'Unit (Qty)' : 'Quantity'}</label>
                  <input type="number" className="form-input" min="0" step="1"
                    value={item.quantity}
                    onChange={e => onItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                    id={`item-qty-${index}`} />
                </div>
                <div className="form-group item-rate-box">
                  <label>{formData.title === 'PURCHASE ORDER' ? 'Unit Price' : 'Rate (₹)'}</label>
                  <input type="number" className="form-input" min="0" step="0.01"
                    value={item.unit_price}
                    onChange={e => onItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                    id={`item-price-${index}`} />
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
          {!user?.org_gst_registered ? (
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
              <label style={{ margin: 0 }}>Show Tax on Invoice?</label>
              <input type="checkbox" checked={formData.show_tax_field}
                onChange={e => onChange('show_tax_field', e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
            </div>
          ) : null}
          <div className="form-group">
            <label htmlFor="input-discount">Discount (%)</label>
            <input id="input-discount" type="number" className="form-input" min="0" max="100" step="0.5"
              value={formData.discount || 0}
              onChange={e => onChange('discount', parseFloat(e.target.value) || 0)} />
          </div>
        </div>
        <div className="totals-summary">
          <div className="total-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
          {formData.discount > 0 ? (
            <div className="total-row"><span>Discount ({formData.discount}%)</span><span>-{fmt(subtotal * formData.discount / 100)}</span></div>
          ) : null}
          {formData.tax_rate > 0 ? (
            user?.org_gst_registered ? (
              <>
                <div className="total-row"><span>CGST ({formData.tax_rate / 2}%)</span><span>{fmt(subtotal * formData.tax_rate / 200)}</span></div>
                <div className="total-row"><span>SGST ({formData.tax_rate / 2}%)</span><span>{fmt(subtotal * formData.tax_rate / 200)}</span></div>
              </>
            ) : (
              formData.show_tax_field ? <div className="total-row"><span>Tax ({formData.tax_rate}%)</span><span>{fmt(subtotal * formData.tax_rate / 100)}</span></div> : null
            )
          ) : null}
          <div className="total-row total-final"><span>Total</span><span>{fmt(total)}</span></div>
        </div>
      </section>

      {/* Bank Details (Hide for PO) */}
      {formData.title !== 'PURCHASE ORDER' && (
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
      )}

      {/* Shipping & Logistics (Hide for PO as it's redundant) */}
      {formData.title !== 'PURCHASE ORDER' && (
        <section className="form-section glass-card">
          <h2 className="section-title"><i className="fas fa-truck"></i> Shipping &amp; Logistics</h2>
          <div className="form-grid cols-2">
            <div className="form-group">
              <label htmlFor="input-po-number">P.O. Number (#)</label>
              <input id="input-po-number" type="text" className="form-input"
                value={formData.po_number || ''} onChange={e => onChange('po_number', e.target.value)}
                placeholder="e.g. 321654" />
            </div>
            <div className="form-group">
              <label htmlFor="input-po-date">P.O. Date</label>
              <input id="input-po-date" type="date" className="form-input"
                value={formData.po_date || ''} onChange={e => onChange('po_date', e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="input-shipping-date">Shipping Date</label>
              <input id="input-shipping-date" type="date" className="form-input"
                value={formData.shipping_date || ''} onChange={e => onChange('shipping_date', e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="input-transport-mode">Transport Mode</label>
              <select id="input-transport-mode" className="form-input"
                value={formData.transport_mode || ''} onChange={e => onChange('transport_mode', e.target.value)}>
                <option value="">Select Mode</option>
                <option value="By Road">By Road</option>
                <option value="By Air">By Air</option>
                <option value="By Sea">By Sea</option>
                <option value="By Rail">By Rail</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="input-transport-name">Transport Name</label>
              <input id="input-transport-name" type="text" className="form-input"
                value={formData.transport_name || ''} onChange={e => onChange('transport_name', e.target.value)}
                placeholder="e.g. ABT Transport" />
            </div>
            <div className="form-group">
              <label htmlFor="input-vehicle-number">Vehicle Number</label>
              <input id="input-vehicle-number" type="text" className="form-input"
                value={formData.vehicle_number || ''} onChange={e => onChange('vehicle_number', e.target.value)}
                placeholder="e.g. TN-01-AB-1234" />
            </div>
            <div className="form-group">
              <label htmlFor="input-eway-bill">E-Way Bill Number</label>
              <input id="input-eway-bill" type="text" className="form-input"
                value={formData.eway_bill || ''} onChange={e => onChange('eway_bill', e.target.value)}
                placeholder="12-digit E-Way Bill #" />
            </div>
            <div className="form-group">
              <label htmlFor="input-sales-person">Sales Person</label>
              <input id="input-sales-person" type="text" className="form-input"
                value={formData.sales_person || ''} onChange={e => onChange('sales_person', e.target.value)}
                placeholder="Name of Sales Person" />
            </div>
          </div>
        </section>
      )}

      {/* Payment Tracking (Hide for PO) */}
      {formData.title !== 'PURCHASE ORDER' && (
        <section className="form-section glass-card">
          <h2 className="section-title"><i className="fas fa-credit-card"></i> Payment Status</h2>
          <div className="form-grid cols-2">
            <div className="form-group">
              <label htmlFor="input-payment-status">Status</label>
              <select id="input-payment-status" className="form-input"
                value={formData.payment_status}
                onChange={e => {
                  const newStatus = e.target.value;
                  onChange('payment_status', newStatus);
                  if (newStatus === 'paid') {
                    onChange('payment_terms', 'No Due');
                  } else {
                    onChange('payment_terms', 'Net 30');
                  }
                }}>
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
      )}

      {/* Notes & Terms */}
      <section className="form-section glass-card">
        <h2 className="section-title">
          <i className="fas fa-sticky-note"></i> {formData.title === 'PURCHASE ORDER' ? 'Comments or Special Instructions' : 'Notes & Terms'}
        </h2>
        <div className="form-group">
          <label htmlFor="input-notes">{formData.title === 'PURCHASE ORDER' ? 'Special Instructions' : 'Notes'}</label>
          <textarea id="input-notes" className="form-input" rows="2"
            value={formData.notes} onChange={e => onChange('notes', e.target.value)}
            placeholder="Any additional notes..." />
        </div>
        {formData.title !== 'PURCHASE ORDER' && (
          <div className="form-group">
            <label htmlFor="input-terms">Terms & Conditions</label>
            <textarea id="input-terms" className="form-input" rows="2"
              value={formData.terms} onChange={e => onChange('terms', e.target.value)}
              placeholder="Payment terms and conditions..." />
          </div>
        )}
      </section>
    </div>
  )
}