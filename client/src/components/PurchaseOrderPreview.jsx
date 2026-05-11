import { forwardRef, useImperativeHandle, useRef } from 'react'

const POPreview = forwardRef(({ user, data, subtotal, taxAmount, total }, ref) => {
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

  const numberToWords = (num) => {
    if (num === 0) return 'Zero';
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const g = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];
    const makeGroup = ([ones, tens, huns]) => {
      return [
        num > 0 && huns > 0 ? `${a[huns]} Hundred` : '',
        [tens > 1 ? b[tens] : a[10 * tens + ones], tens > 1 && ones > 0 ? a[ones] : ''].join(' ')
      ].join(' ');
    };
    const thousandArr = (n) => { let r = []; while (n > 0) { r.push(n % 1000); n = Math.floor(n / 1000); } return r; };
    const numArr = thousandArr(Math.floor(num));
    let res = numArr.map((n, i) => {
      if (n === 0) return '';
      const ones = n % 10; const tens = Math.floor((n % 100) / 10); const huns = Math.floor(n / 100);
      return `${makeGroup([ones, tens, huns])} ${g[i]}`;
    }).reverse().join(' ').trim();
    return res + ' ' + (currentCurrency.unit || 'Rupees') + ' Only';
  };

  const themeColor = data.themeColor || '#003366'
  const primaryColor = themeColor
  const borderColor = '#ddd'
  const lightBg = '#f5f8fc'

  const discountAmount = subtotal * ((data.discount || 0) / 100)
  const taxableAmount = subtotal - discountAmount
  const hasAnyDiscount = data.items.some(item => (item.discount || 0) > 0);
  const hasAnyHSN = data.items.some(item => !!item.hsn);

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
      width: '100%', maxWidth: '210mm', background: 'white', color: '#333',
      padding: '10mm 12mm', fontFamily: '"Inter", sans-serif', fontSize: '10.5px',
      lineHeight: '1.3', boxSizing: 'border-box', position: 'relative',
      minHeight: '297mm', display: 'flex', flexDirection: 'column'
    }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" />

      {/* ── HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
        <div style={{ flex: 1.2 }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ width: '45px', height: '45px', background: data.logo_image ? 'transparent' : primaryColor, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', overflow: 'hidden' }}>
              {data.logo_image ? (
                <img src={data.logo_image} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <i className="fas fa-cube" style={{ fontSize: '20px' }}></i>
              )}
            </div>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#1a1a1a', margin: 0, textTransform: 'uppercase' }}>{data.sender_name || 'YOUR COMPANY'}</h1>
              {data.tagline && <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>{data.tagline}</p>}
            </div>
          </div>
          <div style={{ color: '#444', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '3px' }}><i className="fas fa-map-marker-alt" style={{ color: primaryColor, width: '10px', marginTop: '3px' }}></i> <span style={{ whiteSpace: 'pre-line' }}>{data.sender_address}</span></div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '3px' }}><i className="fas fa-phone-alt" style={{ color: primaryColor, width: '10px' }}></i> <span>{data.sender_phone}</span></div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '3px' }}><i className="fas fa-envelope" style={{ color: primaryColor, width: '10px' }}></i> <span>{data.sender_email}</span></div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '3px' }}><i className="fas fa-globe" style={{ color: primaryColor, width: '10px' }}></i> <span>{data.website}</span></div>
            {data.sender_gstin && <div style={{ display: 'flex', gap: '8px', marginBottom: '3px' }}><i className="fas fa-id-card" style={{ color: primaryColor, width: '10px' }}></i> <span>GSTIN : {data.sender_gstin}</span></div>}
          </div>
        </div>
        <div style={{ textAlign: 'right', flex: 1 }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', color: primaryColor, margin: '-5px 0 10px 0', lineHeight: '1', letterSpacing: '-1px', textTransform: 'uppercase' }}>
            {data.title || 'PURCHASE ORDER'}
          </h1>
          <div style={{ display: 'inline-grid', gridTemplateColumns: 'auto auto', gap: '4px 15px', fontSize: '0.9rem', textAlign: 'left', fontWeight: '500' }}>
            <div style={{ fontWeight: '700' }}>PO Number</div><div>: {data.doc_number}</div>
            <div style={{ fontWeight: '700' }}>PO Date</div><div>: {formatDate(data.date)}</div>
            <div style={{ fontWeight: '700' }}>Expected Delivery Date</div><div>: {formatDate(data.expected_delivery_date)}</div>
            <div style={{ fontWeight: '700' }}>Payment Terms</div><div>: {data.payment_terms || '—'}</div>
            <div style={{ fontWeight: '700' }}>Currency</div><div>: {data.currency || 'INR'}</div>
          </div>
        </div>
      </div>

      <div style={{ height: '1.5px', background: primaryColor, marginBottom: '20px', opacity: 0.3 }}></div>

      {/* ── BUYER / VENDOR ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px', breakInside: 'avoid' }}>
        <div style={{ border: `1px solid ${borderColor}`, borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ background: primaryColor, color: 'white', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '0.8rem' }}>
            <i className="fas fa-user"></i> BUYER (BILL TO)
          </div>
          <div style={{ padding: '8px 10px', fontSize: '0.85rem' }}>
            <h3 style={{ margin: '0 0 3px 0', fontSize: '0.95rem', fontWeight: '800' }}>{data.sender_name}</h3>
            <p style={{ margin: '0 0 3px 0', color: '#444', whiteSpace: 'pre-line' }}>{data.sender_address}</p>
            {data.sender_gstin && <p style={{ margin: '0', fontWeight: '600' }}>GSTIN : {data.sender_gstin}</p>}
            <p style={{ margin: '0' }}>State Code : {user?.org_state_code || '—'}</p>
            <div style={{ marginTop: '5px' }}>
              <p style={{ margin: '0', color: '#666' }}>Contact : {data.sender_phone}</p>
              <p style={{ margin: '0', color: '#666' }}>Email : {data.sender_email}</p>
            </div>
          </div>
        </div>
        <div style={{ border: `1px solid ${borderColor}`, borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ background: primaryColor, color: 'white', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '0.8rem' }}>
            <i className="fas fa-truck"></i> VENDOR (SUPPLIER)
          </div>
          <div style={{ padding: '8px 10px', fontSize: '0.85rem' }}>
            <h3 style={{ margin: '0 0 3px 0', fontSize: '0.95rem', fontWeight: '800' }}>{data.client_name}</h3>
            <p style={{ margin: '0 0 3px 0', color: '#444', whiteSpace: 'pre-line' }}>{data.client_address}</p>
            {data.client_gstin && <p style={{ margin: '0', fontWeight: '600' }}>GSTIN : {data.client_gstin}</p>}
            <p style={{ margin: '0' }}>State Code : {data.client_state_code || '—'}</p>
            <div style={{ marginTop: '5px' }}>
              <p style={{ margin: '0', color: '#666' }}>Contact : {data.client_phone}</p>
              <p style={{ margin: '0', color: '#666' }}>Email : {data.client_email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── ITEMS TABLE ── */}
      <table ref={itemsRef} style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr style={{ background: primaryColor, color: 'white' }}>
            <th style={{ padding: '6px 8px', textAlign: 'center', border: `1px solid ${primaryColor}` }}>S.No.</th>
            <th style={{ padding: '6px 8px', textAlign: 'left', border: `1px solid ${primaryColor}`, width: hasAnyHSN || hasAnyDiscount ? '35%' : '50%' }}>Item Description</th>
            {hasAnyHSN && <th style={{ padding: '6px 8px', textAlign: 'center', border: `1px solid ${primaryColor}` }}>HSN/SAC</th>}
            <th style={{ padding: '6px 8px', textAlign: 'center', border: `1px solid ${primaryColor}` }}>Qty</th>
            <th style={{ padding: '6px 8px', textAlign: 'right', border: `1px solid ${primaryColor}` }}>Unit Price ({currentCurrency.symbol})</th>
            {hasAnyDiscount && <th style={{ padding: '6px 8px', textAlign: 'center', border: `1px solid ${primaryColor}` }}>Discount (%)</th>}
            <th style={{ padding: '6px 8px', textAlign: 'right', border: `1px solid ${primaryColor}` }}>Amount ({currentCurrency.symbol})</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => {
            const lineTotal = item.quantity * item.unit_price;
            const lineDiscount = lineTotal * ((item.discount || 0) / 100);
            return (
              <tr key={index} style={{ breakInside: 'avoid' }}>
                <td style={{ padding: '6px 8px', border: '1px solid #ddd', textAlign: 'center' }}>{index + 1}</td>
                <td style={{ padding: '6px 8px', border: '1px solid #ddd', fontWeight: '500' }}>{item.description}</td>
                {hasAnyHSN && <td style={{ padding: '6px 8px', border: '1px solid #ddd', textAlign: 'center' }}>{item.hsn || '—'}</td>}
                <td style={{ padding: '6px 8px', border: '1px solid #ddd', textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ padding: '6px 8px', border: '1px solid #ddd', textAlign: 'right' }}>{fmt(item.unit_price)}</td>
                {hasAnyDiscount && <td style={{ padding: '6px 8px', border: '1px solid #ddd', textAlign: 'center' }}>{item.discount || 0}%</td>}
                <td style={{ padding: '6px 8px', border: '1px solid #ddd', textAlign: 'right', fontWeight: '600' }}>{fmt(lineTotal - lineDiscount)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ── TERMS + TOTALS ── */}
      <div ref={totalsRef} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '20px', breakInside: 'avoid' }}>
        <div style={{ border: `1px solid ${borderColor}`, borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ background: '#fdfdfd', padding: '6px 10px', borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', gap: '6px', color: primaryColor, fontWeight: '800', fontSize: '0.8rem' }}>
            <i className="fas fa-clipboard-list"></i> TERMS & CONDITIONS
          </div>
          <div style={{ padding: '8px 10px', fontSize: '0.8rem', color: '#555', whiteSpace: 'pre-line', lineHeight: '1.4' }}>
            {data.terms}
          </div>
        </div>
        <div>
          <div style={{ background: '#fff', borderRadius: '6px', border: `1px solid ${borderColor}`, overflow: 'hidden' }}>
            <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: '#444', fontWeight: '600' }}>Subtotal</span>
                <span style={{ fontWeight: '700' }}>{currentCurrency.symbol} {fmt(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: '#666' }}>Discount</span>
                <span style={{ fontWeight: '700' }}>{currentCurrency.symbol} {fmt(discountAmount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: '#444', fontWeight: '600' }}>Taxable Amount</span>
                <span style={{ fontWeight: '700' }}>{currentCurrency.symbol} {fmt(taxableAmount)}</span>
              </div>
              {taxAmount > 0 && (
                user?.org_gst_registered ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                      <span style={{ color: '#666' }}>CGST ({(data.tax_rate / 2).toFixed(0)}%)</span>
                      <span style={{ fontWeight: '700' }}>{currentCurrency.symbol} {fmt(taxAmount / 2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                      <span style={{ color: '#666' }}>SGST ({(data.tax_rate / 2).toFixed(0)}%)</span>
                      <span style={{ fontWeight: '700' }}>{currentCurrency.symbol} {fmt(taxAmount / 2)}</span>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span style={{ color: '#666' }}>Tax ({data.tax_rate}%)</span>
                    <span style={{ fontWeight: '700' }}>{currentCurrency.symbol} {fmt(taxAmount)}</span>
                  </div>
                )
              )}
              {(data.additional_charges || []).filter(c => (parseFloat(c.amount) || 0) !== 0).map((c, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                  <span style={{ color: '#666' }}>{c.label || 'Extra Charge'}</span>
                  <span style={{ fontWeight: '700' }}>{currentCurrency.symbol} {fmt(c.amount)}</span>
                </div>
              ))}
            </div>
            <div style={{ background: primaryColor, color: 'white', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '800', fontSize: '1rem' }}>GRAND TOTAL</span>
              <span style={{ fontWeight: '900', fontSize: '1.15rem' }}>{currentCurrency.symbol} {fmt(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── DELIVERY TO + NOTES ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px', breakInside: 'avoid' }}>
        <div style={{ border: `1px solid ${borderColor}`, borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ background: '#fdfdfd', padding: '6px 10px', borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', gap: '6px', color: primaryColor, fontWeight: '800', fontSize: '0.8rem' }}>
            <i className="fas fa-map-marker-alt"></i> DELIVERY TO
          </div>
          <div style={{ padding: '8px 10px', fontSize: '0.85rem', color: '#444' }}>
            <p style={{ margin: '0', fontWeight: '700' }}>{data.different_shipping ? data.shipping_name : data.sender_name}</p>
            <p style={{ margin: '0', whiteSpace: 'pre-line' }}>{data.different_shipping ? data.shipping_address : data.sender_address}</p>
            <p style={{ margin: '0', color: '#666' }}>Contact : {data.different_shipping ? data.shipping_phone : data.sender_phone}</p>
          </div>
        </div>
        <div style={{ border: `1px solid ${borderColor}`, borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ background: '#fdfdfd', padding: '6px 10px', borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', gap: '6px', color: primaryColor, fontWeight: '800', fontSize: '0.8rem' }}>
            <i className="fas fa-sticky-note"></i> NOTES
          </div>
          <div style={{ padding: '8px 10px', fontSize: '0.85rem', color: '#555', whiteSpace: 'pre-line', fontStyle: 'italic' }}>
            {data.notes || '—'}
          </div>
        </div>
      </div>

      {/* ── PREPARED BY / AUTHORIZED BY ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', marginTop: 'auto', breakInside: 'avoid' }}>
        <div style={{ border: `1px solid ${borderColor}`, padding: '10px 12px' }}>
          <p style={{ margin: '0 0 25px 0', fontWeight: '700', fontSize: '0.9rem' }}>Prepared By</p>
          <p style={{ margin: '0', fontSize: '0.85rem', color: '#666' }}>Name: _________________________</p>
          <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#666' }}>Date: __________________________</p>
        </div>
        <div style={{ border: `1px solid ${borderColor}`, borderLeft: 'none', padding: '10px 12px' }}>
          <p style={{ margin: '0 0 25px 0', fontWeight: '700', fontSize: '0.9rem' }}>Authorized By</p>
          <p style={{ margin: '0', fontSize: '0.85rem', color: '#666' }}>Name: _________________________</p>
          <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#666' }}>Date: __________________________</p>
        </div>
      </div>

      <div ref={footerRef} style={{ position: 'absolute', bottom: '8px', left: 0, right: 0, textAlign: 'center', fontSize: '0.6rem', color: '#ddd' }}>
        Generated using <strong>DOCUFORGE</strong>
      </div>
    </div>
  )
})

POPreview.displayName = 'POPreview'
export default POPreview
