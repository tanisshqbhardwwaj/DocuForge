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

  return (
    <div className="tax-invoice" ref={ref} id="document-preview">
      {/* Header */}
      <div className="ti-header">
        <div className="ti-company">
          <div className="ti-logo">
            {(data.sender_name || 'C')[0].toUpperCase()}
          </div>
          <div className="ti-company-info">
            <h2 className="ti-company-name">{data.sender_name || 'Your Company'}</h2>
            {data.sender_address && <p>{data.sender_address}</p>}
            {data.sender_email && <p>{data.sender_email}</p>}
            {data.sender_phone && <p>{data.sender_phone}</p>}
            {data.sender_gstin && <p><strong>GSTIN: {data.sender_gstin}</strong></p>}
          </div>
        </div>
        <div className="ti-title-block">
          <h1 className="ti-title">{data.title || 'TAX INVOICE'}</h1>
          <p className="ti-number">{data.doc_number}</p>
        </div>
      </div>

      {/* Meta Grid */}
        <div className="ti-meta-row">
          <div className="ti-meta-cell">
            <span className="ti-label">Due Date</span>
            <span className="ti-value">{formatDate(data.due_date)}</span>
          </div>
          {user?.org_gst_registered ? (
            <div className="ti-meta-cell">
              <span className="ti-label">Place of Supply</span>
              <span className="ti-value">{data.place_of_supply || '—'}</span>
            </div>
          ) : (
            <div className="ti-meta-cell">
              <span className="ti-label">Terms</span>
              <span className="ti-value">{data.payment_terms || 'Net 30'}</span>
            </div>
          )}
        </div>
        {user?.org_gst_registered && (
          <div className="ti-meta-row">
            <div className="ti-meta-cell">
              <span className="ti-label">Terms</span>
              <span className="ti-value">{data.payment_terms || 'Net 30'}</span>
            </div>
            <div className="ti-meta-cell"></div>
          </div>
        )}

      {/* Bill To / Ship To */}
      <div className="ti-parties">
        <div className="ti-party">
          <div className="ti-party-label">Details of Receiver (Bill To)</div>
          <h3>{data.client_name || 'Client Name'}</h3>
          {data.client_address && <p>{data.client_address}</p>}
          {data.client_email && <p>{data.client_email}</p>}
          {data.client_phone && <p>Phone: {data.client_phone}</p>}
          {data.client_gstin && <p><strong>GSTIN: {data.client_gstin}</strong></p>}
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
            <th style={{width:'5%'}}>#</th>
            <th style={{width: user?.org_gst_registered ? '35%' : '50%'}}>Item &amp; Description</th>
            {user?.org_gst_registered && <th style={{width:'15%'}}>HSN/SAC</th>}
            <th style={{width:'10%'}}>Qty</th>
            <th style={{width:'15%'}}>Rate</th>
            <th style={{width:'20%'}}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>
                <strong>{item.description || '—'}</strong>
                {user?.org_gst_registered && item.hsn && <div className="ti-hsn-inline">{item.hsn}</div>}
              </td>
              {user?.org_gst_registered && <td>{item.hsn || '—'}</td>}
              <td>{item.quantity}</td>
              <td>₹{fmt(item.unit_price)}</td>
              <td>₹{fmt(item.quantity * item.unit_price)}</td>
            </tr>
          ))}
          {data.items.length === 0 && (
            <tr><td colSpan="6" style={{textAlign:'center', color:'#000000'}}>No items</td></tr>
          )}
        </tbody>
      </table>

      {/* Totals + Amount in Words */}
      <div className="ti-footer-grid">
        <div className="ti-words">
          <div className="ti-label">Total Invoice Amount in Words</div>
          <p className="ti-amount-words"><strong>{numberToWords(total)}</strong></p>

          {/* Bank Details */}
          {(data.bank_name || data.bank_account) && (
            <div className="ti-bank">
              <div className="ti-label" style={{marginTop:'12px'}}>Bank Details</div>
              <table className="ti-bank-table">
                <tbody>
                  {data.bank_name && <tr><td>Name</td><td>: {data.bank_name}</td></tr>}
                  {data.bank_account && <tr><td>A/C No.</td><td>: {data.bank_account}</td></tr>}
                  {data.bank_ifsc && <tr><td>IFSC Code</td><td>: {data.bank_ifsc}</td></tr>}
                  {data.bank_branch && <tr><td>Branch</td><td>: {data.bank_branch}</td></tr>}
                </tbody>
              </table>
            </div>
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
              <span>-₹{fmt(discountAmount)}</span>
            </div>
          )}
          {data.tax_rate > 0 && (
            user?.org_gst_registered ? (
              <>
                <div className="ti-total-row">
                  <span>CGST ({halfTax}%)</span>
                  <span>₹{fmt(cgst)}</span>
                </div>
                <div className="ti-total-row">
                  <span>SGST ({halfTax}%)</span>
                  <span>₹{fmt(sgst)}</span>
                </div>
              </>
            ) : (
              data.show_tax_field && (
                <div className="ti-total-row">
                  <span>Tax ({data.tax_rate}%)</span>
                  <span>₹{fmt(taxableAmount * data.tax_rate / 100)}</span>
                </div>
              )
            )
          )}
          <div className="ti-total-row ti-grand-total">
            <span>Total</span>
            <span>₹{fmt(total)}</span>
          </div>
          <div className="ti-total-row ti-balance">
            <span>Balance Due</span>
            <span>₹{fmt(data.payment_status === 'paid' ? 0 : total)}</span>
          </div>
        </div>
      </div>

      {/* Terms */}
      {data.terms && (
        <div className="ti-terms">
          <div className="ti-label">Terms &amp; Conditions</div>
          <p>{data.terms}</p>
        </div>
      )}

      {data.notes && (
        <div className="ti-notes-footer">
          <p><em>{data.notes}</em></p>
        </div>
      )}

      {/* Signature */}
      <div className="ti-signature">
        <div></div>
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
