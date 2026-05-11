import { forwardRef, useImperativeHandle, useRef } from 'react'

const DocumentPreview = forwardRef(({ user, data, subtotal, taxAmount, total }, ref) => {
  const currencyMap = {
    'INR': { locale: 'en-IN', code: 'INR', symbol: '₹', unit: 'Rupees', subUnit: 'Paise' },
    'USD': { locale: 'en-US', code: 'USD', symbol: '$', unit: 'Dollars', subUnit: 'Cents' },
    'EUR': { locale: 'de-DE', code: 'EUR', symbol: '€', unit: 'Euros', subUnit: 'Cents' },
    'GBP': { locale: 'en-GB', code: 'GBP', symbol: '£', unit: 'Pounds', subUnit: 'Pence' },
    'AED': { locale: 'ar-AE', code: 'AED', symbol: 'د.إ', unit: 'Dirhams', subUnit: 'Fils' }
  };

  const currentCurrency = currencyMap[data.currency || 'INR'];

  const fmt = (val) =>
    new Intl.NumberFormat(currentCurrency.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val || 0)

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    try {
      return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
      })
    } catch { return dateStr }
  }

  // helper to convert number to words
  const numberToWords = (num) => {
    if (num === 0) return 'Zero';
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const g = ['', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion', 'Quintillion', 'Sextillion', 'Septillion', 'Octillion', 'Nonillion', 'Decillion'];
    
    const makeGroup = ([ones, tens, huns]) => {
      return [
        num > 0 && huns > 0 ? `${a[huns]} Hundred` : '',
        [
          tens > 1 ? b[tens] : a[10 * tens + ones],
          tens > 1 && ones > 0 ? a[ones] : ''
        ].join(' ')
      ].join(' ');
    };

    const thousandArr = (n) => {
      let r = [];
      while (n > 0) {
        r.push(n % 1000);
        n = Math.floor(n / 1000);
      }
      return r;
    };

    const numArr = thousandArr(Math.floor(num));
    let res = numArr.map((n, i) => {
      if (n === 0) return '';
      const ones = n % 10;
      const tens = Math.floor((n % 100) / 10);
      const huns = Math.floor(n / 100);
      return `${makeGroup([ones, tens, huns])} ${g[i]}`;
    }).reverse().join(' ').trim();

    return res + ' ' + (currentCurrency.unit || 'Rupees') + ' Only';
  };

  const isPO = data.title === 'PURCHASE ORDER';
  const isCN = data.title === 'CREDIT NOTE';
  
  const discountAmount = subtotal * ((data.discount || 0) / 100)
  const taxableAmount = subtotal - discountAmount
  const hasAnyDiscount = data.items.some(item => (item.discount || 0) > 0);
  const hasAnyHSN = data.items.some(item => !!item.hsn);

  const themeColor = data.themeColor || (isCN ? '#800000' : '#0055d4')
  const primaryBlue = themeColor
  const borderColor = themeColor + '40' // 25% opacity for borders

  const headerRef = useRef(null);
  const itemsRef = useRef(null);
  const totalsRef = useRef(null);
  const bankRef = useRef(null);
  const footerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    scrollToHeader: () => headerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    scrollToItems: () => itemsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    scrollToTotals: () => totalsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
    scrollToBank: () => bankRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
    scrollToFooter: () => footerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }),
    getDomElement: () => headerRef.current,
  }));

  return (
    <div className="document-template" ref={headerRef} style={{
      width: '100%',
      maxWidth: '210mm',
      background: 'white',
      color: '#333',
      padding: '10mm 12mm',
      fontFamily: '"Inter", sans-serif',
      fontSize: '10.5px',
      lineHeight: '1.3',
      boxSizing: 'border-box',
      position: 'relative',
      minHeight: '297mm',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" />
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ width: '45px', height: '45px', background: data.logo_image ? 'transparent' : primaryBlue, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', overflow: 'hidden' }}>
              {data.logo_image ? (
                <img src={data.logo_image} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <i className="fas fa-cube" style={{ fontSize: '20px' }}></i>
              )}
            </div>
            <div>
              <h1 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#1a1a1a', margin: 0, textTransform: 'uppercase' }}>{data.sender_name || 'YOUR COMPANY'}</h1>
              {data.tagline && <p style={{ fontSize: '0.75rem', color: '#666', margin: 0 }}>{data.tagline}</p>}
            </div>
          </div>
          <div style={{ color: '#444', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '3px' }}><i className="fas fa-map-marker-alt" style={{ color: primaryBlue, width: '10px', marginTop: '3px' }}></i> <span style={{ whiteSpace: 'pre-line' }}>{data.sender_address}</span></div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '3px' }}><i className="fas fa-phone-alt" style={{ color: primaryBlue, width: '10px' }}></i> <span>{data.sender_phone}</span></div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '3px' }}><i className="fas fa-envelope" style={{ color: primaryBlue, width: '10px' }}></i> <span>{data.sender_email}</span></div>
            {data.sender_gstin && <div style={{ display: 'flex', gap: '8px', marginBottom: '3px' }}><i className="fas fa-id-card" style={{ color: primaryBlue, width: '10px' }}></i> <span>GSTIN : {data.sender_gstin}</span></div>}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: '900', color: primaryBlue, margin: '-5px 0 5px 0', lineHeight: '1', letterSpacing: '-1px', textTransform: 'uppercase' }}>
            {data.title || 'INVOICE'}
          </h1>
          <div style={{ display: 'inline-grid', gridTemplateColumns: 'auto auto', gap: '5px 15px', fontSize: '0.9rem', textAlign: 'left', fontWeight: '500' }}>
            <div style={{ fontWeight: '700' }}>{isPO ? 'PO Number' : (isCN ? 'Credit Note No.' : 'Invoice No.')}</div><div>: {data.doc_number}</div>
            <div style={{ fontWeight: '700' }}>{isPO ? 'PO Date' : (isCN ? 'Credit Note Date' : 'Invoice Date')}</div><div>: {formatDate(data.date)}</div>
            {isPO && <><div style={{ fontWeight: '700' }}>Expected Delivery</div><div>: {formatDate(data.expected_delivery_date)}</div></>}
            {!isPO && !isCN && <><div style={{ fontWeight: '700' }}>Due Date</div><div>: {formatDate(data.due_date)}</div></>}
            <div style={{ fontWeight: '700' }}>Payment Terms</div><div>: {data.payment_terms || 'Net 15 Days'}</div>
          </div>
        </div>
      </div>

      <div style={{ height: '1.5px', background: '#eee', marginBottom: '20px' }}></div>

      {/* Bill To / Ship To Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
        <div style={{ border: `1px solid ${borderColor}`, borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ background: primaryBlue, color: 'white', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '0.8rem' }}>
            <i className="fas fa-user" style={{ fontSize: '0.75rem' }}></i> {isPO ? 'BUYER (BILL TO)' : (isCN ? 'SELLER (FROM)' : 'BILL TO')}
          </div>
          <div style={{ padding: '8px 12px', fontSize: '0.9rem' }}>
            <h3 style={{ margin: '0 0 3px 0', fontSize: '1rem', fontWeight: '800' }}>{(isPO || isCN) ? data.sender_name : data.client_name}</h3>
            <p style={{ margin: '0 0 3px 0', color: '#444', whiteSpace: 'pre-line' }}>{(isPO || isCN) ? data.sender_address : data.client_address}</p>
            {data.client_phone && <p style={{ margin: '0', color: '#666' }}>Phone : {data.client_phone}</p>}
            {data.client_email && <p style={{ margin: '0', color: '#666' }}>Email : {data.client_email}</p>}
            {data.client_gstin && <p style={{ margin: '0', fontWeight: '700' }}>GSTIN : {data.client_gstin}</p>}
          </div>
        </div>
        
        <div style={{ border: `1px solid ${borderColor}`, borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ background: primaryBlue, color: 'white', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '0.8rem' }}>
            <i className="fas fa-truck" style={{ fontSize: '0.75rem' }}></i> {isPO ? 'VENDOR (SUPPLIER)' : (isCN ? 'CUSTOMER (TO)' : 'SHIP TO')}
          </div>
          <div style={{ padding: '8px 12px', fontSize: '0.9rem' }}>
            <h3 style={{ margin: '0 0 3px 0', fontSize: '1rem', fontWeight: '800' }}>
              {(isPO || isCN) ? data.client_name : (data.different_shipping ? data.shipping_name : data.client_name)}
            </h3>
            <p style={{ margin: '0 0 3px 0', color: '#444', whiteSpace: 'pre-line' }}>
              {(isPO || isCN) ? data.client_address : (data.different_shipping ? data.shipping_address : data.client_address)}
            </p>
            {data.different_shipping ? (
              <>
                {data.shipping_phone && <p style={{ margin: '0', color: '#666' }}>Phone : {data.shipping_phone}</p>}
                {data.shipping_gstin && <p style={{ margin: '0', fontWeight: '700' }}>GSTIN : {data.shipping_gstin}</p>}
                {data.shipping_state_code && <p style={{ margin: '0', color: '#666' }}>State Code : {data.shipping_state_code}</p>}
              </>
            ) : (
              <>
                {data.client_phone && <p style={{ margin: '0', color: '#666' }}>Phone : {data.client_phone}</p>}
                {data.client_gstin && <p style={{ margin: '0', fontWeight: '700' }}>GSTIN : {data.client_gstin}</p>}
                {data.client_state_code && <p style={{ margin: '0', color: '#666' }}>State Code : {data.client_state_code}</p>}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table ref={itemsRef} style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr style={{ background: primaryBlue, color: 'white' }}>
            <th style={{ padding: '8px', textAlign: 'left', border: `1px solid ${primaryBlue}` }}>S.No.</th>
            <th style={{ padding: '8px', textAlign: 'left', border: `1px solid ${primaryBlue}`, width: hasAnyHSN ? '40%' : '50%' }}>Item Description</th>
            {hasAnyHSN && <th style={{ padding: '8px', textAlign: 'center', border: `1px solid ${primaryBlue}` }}>HSN/SAC</th>}
            <th style={{ padding: '8px', textAlign: 'center', border: `1px solid ${primaryBlue}` }}>Qty</th>
            <th style={{ padding: '8px', textAlign: 'right', border: `1px solid ${primaryBlue}` }}>Rate ({currentCurrency.symbol})</th>
            {hasAnyDiscount && <th style={{ padding: '8px', textAlign: 'center', border: `1px solid ${primaryBlue}` }}>Disc %</th>}
            <th style={{ padding: '8px', textAlign: 'right', border: `1px solid ${primaryBlue}` }}>Amount ({currentCurrency.symbol})</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <td style={{ padding: '8px', border: '1px solid #eee', textAlign: 'center' }}>{index + 1}</td>
              <td style={{ padding: '8px', border: '1px solid #eee' }}>{item.description}</td>
              {hasAnyHSN && <td style={{ padding: '8px', border: '1px solid #eee', textAlign: 'center' }}>{item.hsn || '—'}</td>}
              <td style={{ padding: '8px', border: '1px solid #eee', textAlign: 'center' }}>{item.quantity} {item.unit}</td>
              <td style={{ padding: '8px', border: '1px solid #eee', textAlign: 'right' }}>{fmt(item.unit_price)}</td>
              {hasAnyDiscount && <td style={{ padding: '8px', border: '1px solid #eee', textAlign: 'center' }}>{item.discount}%</td>}
              <td style={{ padding: '8px', border: '1px solid #eee', textAlign: 'right' }}>{fmt(item.quantity * item.unit_price * (1 - (item.discount || 0) / 100))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals Section */}
      <div ref={totalsRef} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '20px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
        <div>
          <div style={{ border: `1px solid ${borderColor}`, borderRadius: '10px', padding: '10px 12px', background: '#f8fbff', minHeight: '60px' }}>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '0.85rem', fontWeight: '800', color: primaryBlue }}>Amount in Words</h4>
            <p style={{ fontSize: '0.9rem', color: '#333', margin: 0, fontWeight: '700' }}>{numberToWords(total)}</p>
          </div>
        </div>
        <div>
          <div style={{ background: '#f8fbff', borderRadius: '10px', border: `1px solid ${borderColor}` }}>
            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: '#666' }}>Subtotal</span>
                <span style={{ fontWeight: '700' }}>{currentCurrency.symbol} {fmt(subtotal)}</span>
              </div>
              {taxAmount > 0 && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span style={{ color: '#666' }}>CGST ({(data.tax_rate/2).toFixed(1)}%)</span>
                    <span style={{ fontWeight: '700' }}>{currentCurrency.symbol} {fmt(taxAmount / 2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span style={{ color: '#666' }}>SGST ({(data.tax_rate/2).toFixed(1)}%)</span>
                    <span style={{ fontWeight: '700' }}>{currentCurrency.symbol} {fmt(taxAmount / 2)}</span>
                  </div>
                </>
              )}
              {/* Additional Charges */}
              {(data.additional_charges || []).map((charge, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                  <span style={{ color: '#666' }}>{charge.label || 'Additional Charge'}</span>
                  <span style={{ fontWeight: '700', color: parseFloat(charge.amount) < 0 ? '#d32f2f' : '#333' }}>
                    {parseFloat(charge.amount) < 0 ? '- ' : ''}{currentCurrency.symbol} {fmt(Math.abs(parseFloat(charge.amount) || 0))}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ background: primaryBlue, color: 'white', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px -12px -12px -12px', borderRadius: '0 0 10px 10px' }}>
              <span style={{ fontWeight: '900', fontSize: '1.1rem' }}>GRAND TOTAL</span>
              <span style={{ fontWeight: '900', fontSize: '1.1rem' }}>{currentCurrency.symbol} {fmt(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '15px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
        <div ref={bankRef} style={{ border: `1px solid ${borderColor}`, borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ background: '#f8fbff', color: primaryBlue, padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '800', fontSize: '0.8rem', borderBottom: `1px solid ${borderColor}` }}>
            <i className="fas fa-university" style={{ fontSize: '0.75rem' }}></i> PAYMENT DETAILS
          </div>
          <div style={{ padding: '8px 12px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 15px', fontSize: '0.9rem' }}>
            <div style={{ color: '#666', fontWeight: '600' }}>Bank Name</div><div>: {data.bank_name || '—'}</div>
            <div style={{ color: '#666', fontWeight: '600' }}>A/C Number</div><div>: {data.bank_account || '—'}</div>
            <div style={{ color: '#666', fontWeight: '600' }}>IFSC Code</div><div>: {data.bank_ifsc || '—'}</div>
            <div style={{ color: '#666', fontWeight: '600' }}>UPI ID</div><div>: {data.upi_id || '—'}</div>
          </div>
        </div>
        <div style={{ border: `1px solid ${borderColor}`, borderRadius: '10px', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: '15px', padding: '8px 12px' }}>
          <div style={{ width: '60px', height: '60px', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '6px' }}>
            {data.qr_code_image ? (
              <img src={data.qr_code_image} alt="QR Code" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <div style={{ textAlign: 'center' }}><i className="fas fa-qrcode" style={{ fontSize: '30px', color: '#ccc' }}></i></div>
            )}
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: primaryBlue, marginBottom: '2px' }}>Scan & Pay (UPI)</div>
            <div style={{ fontSize: '0.85rem', color: '#555', fontWeight: '600' }}>{data.upi_id || '—'}</div>
          </div>
        </div>
      </div>

      {/* Footer Area: Terms & Conditions and Notes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginTop: 'auto', borderTop: '1px solid #eee', paddingTop: '12px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
        <div>
          <h4 style={{ margin: '0 0 5px 0', fontSize: '0.9rem', fontWeight: '800', color: primaryBlue }}>Terms & Conditions</h4>
          <div style={{ fontSize: '0.8rem', color: '#555', whiteSpace: 'pre-line', lineHeight: '1.3' }}>
            {data.terms || `1. Payment to be made within the due date mentioned above.\n2. Late payments may attract interest charges.\n3. Goods once sold will not be taken back.`}
          </div>
        </div>
        <div>
          {data.notes && (
            <>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '0.9rem', fontWeight: '800', color: primaryBlue }}>Notes</h4>
              <div style={{ fontSize: '0.8rem', color: '#555', whiteSpace: 'pre-line', lineHeight: '1.3' }}>
                {data.notes}
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ borderTop: '1.2px solid #eee', marginTop: '15px', paddingTop: '15px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ textAlign: 'center', width: '180px' }}>
             <div style={{ height: '30px' }}></div>
             <div style={{ borderTop: '1px solid #333', paddingTop: '3px', fontSize: '0.85rem', fontWeight: '800' }}>Authorized Signature</div>
          </div>
        </div>
      </div>

      <div ref={footerRef} style={{ position: 'absolute', bottom: '8px', left: 0, right: 0, textAlign: 'center', fontSize: '0.65rem', color: '#ccc' }}>
        Generated using <strong>DOCUFORGE</strong>
      </div>
    </div>
  )
})

DocumentPreview.displayName = 'DocumentPreview'
export default DocumentPreview
