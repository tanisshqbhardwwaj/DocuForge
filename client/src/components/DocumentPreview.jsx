import { forwardRef } from 'react'

const DocumentPreview = forwardRef(({ user, data, subtotal, taxAmount, total }, ref) => {
  const fmt = (val) =>
    new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val || 0)

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    try {
      return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      })
    } catch { return dateStr }
  }

  // Split GST into CGST + SGST (intra-state) or show as IGST
  const discountAmount = subtotal * ((data.discount || 0) / 100)
  const taxableAmount = subtotal - discountAmount
  const halfTax = (data.tax_rate || 0) / 2
  const cgst = taxableAmount * (halfTax / 100)
  const sgst = taxableAmount * (halfTax / 100)

  const isPO = data.title === 'PURCHASE ORDER'

  // Amount in words
  const numberToWords = (num) => {
    if (num === 0) return 'Zero'
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

    const convert = (n) => {
      if (n < 20) return ones[n]
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '')
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convert(n % 100) : '')
      if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '')
      if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '')
      return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '')
    }

    const rupees = Math.floor(num)
    const paise = Math.round((num - rupees) * 100)
    let result = convert(rupees) + ' Rupees'
    if (paise > 0) result += ' and ' + convert(paise) + ' Paise'
    result += ' Only'
    return result
  }

  const getDocTheme = () => {
    const title = (data.title || '').toUpperCase()
    if (title.includes('PURCHASE ORDER')) return 'theme-po'
    if (title.includes('CREDIT NOTE')) return 'theme-cn'
    if (title.includes('PROFORMA INVOICE')) return 'theme-pi'
    return 'theme-inv' // Default invoice theme
  }

  const getPartyLabels = () => {
    const title = (data.title || '').toUpperCase()
    if (title.includes('PURCHASE ORDER')) {
      return { from: 'From (Buyer)', to: 'Vendor Details (Seller)' }
    }
    if (title.includes('CREDIT NOTE')) {
      return { from: 'From', to: 'Customer Details' }
    }
    return { from: 'From', to: 'Details of Receiver (Bill To)' }
  }

  const labels = getPartyLabels()

  const isPOTheme = getDocTheme() === 'theme-po'

  if (isPOTheme) {
    return (
      <div className={`tax-invoice ${getDocTheme()}`} ref={ref}>
        {/* PO Header */}
        <div className="ti-po-header">
          <div className="ti-company-info">
            {user?.org_logo && (
              <img src={user.org_logo} alt="Logo" style={{ height: '60px', marginBottom: '10px' }} />
            )}
            <h2 style={{ color: '#0077c2', marginBottom: '5px' }}>{data.sender_name}</h2>
            <p style={{ fontSize: '12px' }}>{data.sender_address}</p>
            <p style={{ fontSize: '12px' }}>Phone: {data.sender_phone}</p>
            {data.sender_email && <p style={{ fontSize: '12px' }}>{data.sender_email}</p>}
          </div>
          <div className="ti-po-right">
            <h1 className="ti-po-title">PURCHASE ORDER</h1>
            <div className="ti-po-meta">
              <div className="ti-po-meta-row">
                <span className="ti-po-meta-label">DATE</span>
                <span className="ti-po-meta-val">{formatDate(data.date)}</span>
              </div>
              <div className="ti-po-meta-row">
                <span className="ti-po-meta-label">PO #</span>
                <span className="ti-po-meta-val">{data.doc_number || '—'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* PO Parties */}
        <div className="ti-po-party-grid">
          <div className="ti-po-box">
            <div className="ti-po-box-header">VENDOR</div>
            <div className="ti-po-box-content">
              <strong>{data.client_name}</strong><br />
              {data.client_contact && <>Attn: {data.client_contact}<br /></>}
              {data.client_address}
              {data.client_phone && <><br />Phone: {data.client_phone}</>}
              {data.client_gstin && <><br />GSTIN: {data.client_gstin}</>}
              {data.client_pan && <><br />PAN: {data.client_pan}</>}
            </div>
          </div>
          <div className="ti-po-box">
            <div className="ti-po-box-header">SHIP TO</div>
            <div className="ti-po-box-content">
              {data.use_diff_ship_to ? (
                <>
                  <strong>{data.ship_to_name}</strong><br />
                  {data.ship_to_address}
                  {data.ship_to_phone && <><br />Phone: {data.ship_to_phone}</>}
                </>
              ) : (
                <>
                  <strong>{data.sender_name}</strong><br />
                  {data.sender_address}
                  {data.sender_phone && <><br />Phone: {data.sender_phone}</>}
                </>
              )}
            </div>
          </div>
        </div>

        {/* PO Logistics */}
        <div className="ti-po-logistics-bar">
          <div className="ti-po-log-item">
            <div className="ti-po-log-header">REQUISITIONER</div>
            <div className="ti-po-log-val">{data.sales_person || '—'}</div>
          </div>
          <div className="ti-po-log-item">
            <div className="ti-po-log-header">SHIP VIA</div>
            <div className="ti-po-log-val">{data.transport_mode || '—'}</div>
          </div>
          <div className="ti-po-log-item">
            <div className="ti-po-log-header">F.O.B.</div>
            <div className="ti-po-log-val">{data.place_of_supply || '—'}</div>
          </div>
          <div className="ti-po-log-item">
            <div className="ti-po-log-header">PAYMENT TERMS</div>
            <div className="ti-po-log-val">{data.payment_terms || '—'}</div>
          </div>
        </div>

        {/* PO Table */}
        <table className="ti-table">
          <thead>
            <tr>
              <th style={{ width: '15%' }}>ITEM CODE</th>
              <th style={{ width: '40%' }}>DESCRIPTION</th>
              <th style={{ width: '15%' }}>UNIT</th>
              <th style={{ width: '15%' }}>UNIT PRICE</th>
              <th style={{ width: '15%' }}>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index} style={{ minHeight: '30px' }}>
                <td>{item.hsn || '—'}</td>
                <td>{item.description}</td>
                <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right' }}>{fmt(item.unit_price)}</td>
                <td style={{ textAlign: 'right' }}>{fmt(item.quantity * item.unit_price)}</td>
              </tr>
            ))}
            {/* Fill empty space to match image style */}
            {[...Array(Math.max(0, 8 - data.items.length))].map((_, i) => (
              <tr key={`empty-${i}`} style={{ height: '25px' }}>
                <td></td><td></td><td></td><td></td><td></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PO Footer */}
        <div className="ti-po-footer-grid">
          <div className="ti-po-instructions">
            <div className="ti-po-box" style={{ minHeight: '80px' }}>
              <div className="ti-po-box-header">Comments or Special Instructions</div>
              <div className="ti-po-box-content">{data.notes || '—'}</div>
            </div>
          </div>
          <div className="ti-po-totals">
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 8px' }}>
              <span>SUBTOTAL</span>
              <span>{fmt(subtotal)}</span>
            </div>
            {data.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 8px' }}>
                <span>DISCOUNT ({data.discount}%)</span>
                <span>- {fmt((subtotal * data.discount) / 100)}</span>
              </div>
            )}
            {taxAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 8px' }}>
                <span>TAX</span>
                <span>{fmt(taxAmount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 8px' }}>
              <span>SHIPPING</span>
              <span>—</span>
            </div>
            <div className="ti-po-total-line-final">
              <span>TOTAL</span>
              <span>₹ {fmt(total)}</span>
            </div>
          </div>
        </div>

        {/* Signature & Branding */}
        <div className="ti-signature" style={{ marginTop: '30px' }}>
          <div className="ti-branding">
            <p>Generated by <strong>DocuForge</strong></p>
            <span>Professional Billing Suite</span>
          </div>
          <div className="ti-sig-block">
            <p>For <strong>{data.sender_name || 'Your Company'}</strong></p>
            <div className="ti-sig-line"></div>
            <p>Authorized Signatory</p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px', paddingBottom: '10px', fontSize: '11px', color: '#64748b' }}>
          If you have any questions about this purchase order, please contact<br />
          [{data.sender_name}, {data.sender_phone}, {data.sender_email}]
        </div>
      </div>
    )
  }

  // Fallback to original Tax Invoice layout
  return (
    <div className={`tax-invoice ${getDocTheme()}`} ref={ref}>
      {/* Header */}
      <div className="ti-header">
        <div className="ti-company">
          {user?.org_logo ? (
            <div className="ti-logo-container">
              <img src={user.org_logo} alt="Company Logo" className="ti-logo-img" />
            </div>
          ) : (
            <div className="ti-logo">
              {(data.sender_name || 'C')[0].toUpperCase()}
            </div>
          )}
          <div className="ti-company-info">
            <h2 className="ti-company-name">{data.sender_name || 'Your Company'}</h2>
            <p className="ti-role-label" style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
              {labels.from}
            </p>
            {data.sender_address ? <p>{data.sender_address}</p> : null}
            {data.sender_email ? <p>{data.sender_email}</p> : null}
            {data.sender_phone ? <p>{data.sender_phone}</p> : null}
            {data.sender_gstin ? <p><strong>GSTIN: {data.sender_gstin}</strong></p> : null}
            {data.sender_state ? <p>State: {data.sender_state}</p> : null}
            {data.sender_pan ? <p>PAN: {data.sender_pan}</p> : null}
          </div>
        </div>
        <div className="ti-title-block">
          <h1 className="ti-title">{data.title || 'TAX INVOICE'}</h1>
          <p className="ti-number">{data.doc_number}</p>
        </div>
      </div>

      {/* Meta Grid */}
      <div className="ti-meta-grid">
        <div className="ti-meta-row">
          <div className="ti-meta-cell">
            <span className="ti-label">{(data.title || '').includes('PURCHASE') ? 'P.O. Date' : 'Invoice Date'}</span>
            <span className="ti-value">{formatDate(data.date)}</span>
          </div>
          <div className="ti-meta-cell">
            <span className="ti-label">Due Date</span>
            <span className="ti-value">{formatDate(data.due_date)}</span>
          </div>
        </div>
        <div className="ti-meta-row">
          <div className="ti-meta-cell">
            <span className="ti-label">Terms</span>
            <span className="ti-value">{data.payment_terms || 'Net 30'}</span>
          </div>
          <div className="ti-meta-cell">
            <span className="ti-label">Place of Supply</span>
            <span className="ti-value">{data.place_of_supply || '—'}</span>
          </div>
        </div>
        <div className="ti-meta-row">
          <div className="ti-meta-cell">
            <span className="ti-label">Shipping Date</span>
            <span className="ti-value">{formatDate(data.shipping_date) || '—'}</span>
          </div>
          <div className="ti-meta-cell">
            <span className="ti-label">Transport Mode</span>
            <span className="ti-value">{data.transport_mode || '—'}</span>
          </div>
        </div>
        <div className="ti-meta-row">
          <div className="ti-meta-cell">
            <span className="ti-label">Vehicle Number</span>
            <span className="ti-value">{data.vehicle_number || '—'}</span>
          </div>
          <div className="ti-meta-cell">
            <span className="ti-label">Sales Person</span>
            <span className="ti-value">{data.sales_person || '—'}</span>
          </div>
        </div>
      </div>

      {/* Bill To / Ship To */}
      <div className="ti-parties">
        <div className="ti-party">
          <div className="ti-party-label">{labels.to}</div>
          <h3>{data.client_name || 'Client Name'}</h3>
          {data.client_contact ? <p>Attn: {data.client_contact}</p> : null}
          {data.client_address ? <p>{data.client_address}</p> : null}
          {data.client_email ? <p>{data.client_email}</p> : null}
          {data.client_phone ? <p>Phone: {data.client_phone}</p> : null}
          {data.client_gstin ? <p><strong>GSTIN: {data.client_gstin}</strong></p> : null}
          {data.client_state ? <p>State: {data.client_state}</p> : null}
        </div>
        <div className="ti-party">
          <div className="ti-party-label">Details of Consignee (Ship To)</div>
          <h3>{data.ship_to_name || data.client_name || 'Same as Billing'}</h3>
          <p>{data.ship_to_address || data.client_address || '—'}</p>
        </div>
      </div>

      {/* Items Table */}
      <table className="ti-table">
        <thead>
          <tr>
            <th style={{ width: '5%' }}>#</th>
            <th style={{ width: '45%' }}>Item & Description</th>
            <th style={{ width: '10%' }}>HSN/SAC</th>
            <th style={{ width: '10%' }}>Qty/Unit</th>
            <th style={{ width: '15%' }}>Rate</th>
            <th style={{ width: '15%' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <strong>{item.description || '—'}</strong>
                {item.hsn && <div className="ti-hsn-inline">{item.hsn}</div>}
              </td>
              <td>{item.hsn || '—'}</td>
              <td>{item.quantity} {item.unit}</td>
              <td>₹{fmt(item.unit_price)}</td>
              <td>₹{fmt(item.quantity * item.unit_price)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals + Amount in Words */}
      <div className="ti-footer-grid">
        <div className="ti-words">
          <div className="ti-label">Total Invoice Amount in Words</div>
          <p className="ti-amount-words"><strong>{numberToWords(total)}</strong></p>

          {(data.bank_name || data.bank_account) && (
            <>
              <div className="ti-label" style={{ marginTop: '15px' }}>Bank Details</div>
              <table className="ti-bank-table">
                <tbody>
                  {data.bank_name && <tr><td>Name</td><td>: {data.bank_name}</td></tr>}
                  {data.bank_account && <tr><td>A/C No.</td><td>: {data.bank_account}</td></tr>}
                  {data.bank_ifsc && <tr><td>IFSC Code</td><td>: {data.bank_ifsc}</td></tr>}
                  {data.bank_branch && <tr><td>Branch</td><td>: {data.bank_branch}</td></tr>}
                </tbody>
              </table>
            </>
          )}
        </div>
        <div className="ti-totals">
          <div className="ti-total-row">
            <span>Sub Total</span>
            <span>₹{fmt(subtotal)}</span>
          </div>
          {data.discount > 0 && (
            <div className="ti-total-row">
              <span>Discount ({data.discount}%)</span>
              <span>-₹{fmt(subtotal * (data.discount / 100))}</span>
            </div>
          )}
          {data.tax_rate > 0 && (
            user?.org_gst_registered ? (
              <>
                <div className="ti-total-row">
                  <span>CGST ({(data.tax_rate / 2)}%)</span>
                  <span>₹{fmt(taxAmount / 2)}</span>
                </div>
                <div className="ti-total-row">
                  <span>SGST ({(data.tax_rate / 2)}%)</span>
                  <span>₹{fmt(taxAmount / 2)}</span>
                </div>
              </>
            ) : (
              data.show_tax_field ? (
                <div className="ti-total-row">
                  <span>Tax ({data.tax_rate}%)</span>
                  <span>₹{fmt(taxAmount)}</span>
                </div>
              ) : null
            )
          )}
          <div className="ti-total-row ti-grand-total">
            <span>Total</span>
            <span>₹{fmt(total)}</span>
          </div>
          <div className={`ti-total-row ${data.payment_status !== 'paid' ? 'ti-balance' : ''}`}>
            <span>Balance Due</span>
            <span>₹{fmt(data.payment_status === 'paid' ? 0 : total)}</span>
          </div>
          {data.payment_status === 'paid' && (
            <div className="ti-total-row" style={{ color: '#10b981', fontWeight: '900', fontSize: '0.85rem', paddingTop: '8px', borderTop: '1px dashed #cbd5e1', marginTop: '4px' }}>
              <span>PAYMENT STATUS</span>
              <span>PAID</span>
            </div>
          )}
        </div>
      </div>

      {/* Terms */}
      {data.terms ? (
        <div className="ti-terms">
          <div className="ti-label">Terms &amp; Conditions</div>
          <p>{data.terms}</p>
        </div>
      ) : null}

      {data.notes ? (
        <div className="ti-notes-footer">
          <p><em>{data.notes}</em></p>
        </div>
      ) : null}

      {/* Signature */}
      <div className="ti-signature">
        <div className="ti-branding">
          <p>Generated by <strong>DocuForge</strong></p>
          <span>Professional Billing Suite</span>
        </div>
        <div className="ti-sig-block">
          <p>For <strong>{data.sender_name || 'Your Company'}</strong></p>
          <div className="ti-sig-line"></div>
          <p>Authorized Signatory</p>
        </div>
      </div>
    </div>
  )
})

DocumentPreview.displayName = 'DocumentPreview'
export default DocumentPreview
