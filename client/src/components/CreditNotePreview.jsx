import { forwardRef, useImperativeHandle, useRef } from 'react'

const CreditNotePreview = forwardRef(({ user, data, subtotal, taxAmount, total }, ref) => {
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

  const discountAmount = subtotal * ((data.discount || 0) / 100)
  const taxableAmount = subtotal - discountAmount
  const hasAnyDiscount = data.items.some(item => (item.discount || 0) > 0);
  const hasAnyHSN = data.items.some(item => !!item.hsn);

  const themeColor = data.themeColor || '#800000'
  const primaryMaroon = themeColor
  const lightBg = '#fdfafa'
  const borderColor = '#eee'

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
        <div style={{ flex: 1.2 }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ width: '45px', height: '45px', background: data.logo_image ? 'transparent' : primaryMaroon, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', overflow: 'hidden' }}>
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
            <div style={{ display: 'flex', gap: '8px', marginBottom: '3px' }}><i className="fas fa-map-marker-alt" style={{ color: primaryMaroon, width: '10px', marginTop: '3px' }}></i> <span style={{ whiteSpace: 'pre-line' }}>{data.sender_address}</span></div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '3px' }}><i className="fas fa-phone-alt" style={{ color: primaryMaroon, width: '10px' }}></i> <span>{data.sender_phone}</span></div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '3px' }}><i className="fas fa-envelope" style={{ color: primaryMaroon, width: '10px' }}></i> <span>{data.sender_email}</span></div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '3px' }}><i className="fas fa-globe" style={{ color: primaryMaroon, width: '10px' }}></i> <span>{data.website}</span></div>
            {data.sender_gstin && <div style={{ display: 'flex', gap: '8px', marginBottom: '3px' }}><i className="fas fa-id-card" style={{ color: primaryMaroon, width: '10px' }}></i> <span>GSTIN : {data.sender_gstin}</span></div>}
          </div>
        </div>
        <div style={{ textAlign: 'right', flex: 1 }}>
          <h1 style={{ fontSize: '3.2rem', fontWeight: '900', color: primaryMaroon, margin: '-5px 0 10px 0', lineHeight: '1', letterSpacing: '-1px', textTransform: 'uppercase' }}>
            {data.title || 'CREDIT NOTE'}
          </h1>
          <div style={{ display: 'inline-grid', gridTemplateColumns: 'auto auto', gap: '4px 15px', fontSize: '0.9rem', textAlign: 'left', fontWeight: '500' }}>
            <div style={{ fontWeight: '700' }}>Credit Note No.</div><div>: {data.doc_number}</div>
            <div style={{ fontWeight: '700' }}>Credit Note Date</div><div>: {formatDate(data.date)}</div>
            <div style={{ fontWeight: '700' }}>Related Invoice No.</div><div>: {data.related_invoice_number || '—'}</div>
            <div style={{ fontWeight: '700' }}>Related Invoice Date</div><div>: {formatDate(data.related_invoice_date)}</div>
            <div style={{ fontWeight: '700' }}>Place of Supply</div><div>: {data.place_of_supply || '—'}</div>
          </div>
        </div>
      </div>

      <div style={{ height: '1.5px', background: primaryMaroon, marginBottom: '20px', opacity: 0.3 }}></div>

      {/* From / To Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px', breakInside: 'avoid' }}>
        <div style={{ border: `1px solid ${borderColor}`, borderRadius: '6px', overflow: 'hidden', background: '#fff' }}>
          <div style={{ background: primaryMaroon, color: 'white', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '0.8rem' }}>
            <i className="fas fa-store"></i> SELLER (FROM)
          </div>
          <div style={{ padding: '8px 10px', fontSize: '0.85rem' }}>
            <h3 style={{ margin: '0 0 3px 0', fontSize: '0.95rem', fontWeight: '800' }}>{data.sender_name}</h3>
            <p style={{ margin: '0 0 3px 0', color: '#444', whiteSpace: 'pre-line' }}>{data.sender_address}</p>
            <p style={{ margin: '0', fontWeight: '600' }}>GSTIN : {data.sender_gstin}</p>
            <p style={{ margin: '0' }}>State Code : {user?.org_state_code || '—'}</p>
            <div style={{ marginTop: '5px' }}>
              <p style={{ margin: '0', color: '#666' }}>Contact : {data.sender_phone}</p>
              <p style={{ margin: '0', color: '#666' }}>Email : {data.sender_email}</p>
            </div>
          </div>
        </div>
        
        <div style={{ border: `1px solid ${borderColor}`, borderRadius: '6px', overflow: 'hidden', background: '#fff' }}>
          <div style={{ background: primaryMaroon, color: 'white', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '0.8rem' }}>
            <i className="fas fa-user"></i> CUSTOMER (TO)
          </div>
          <div style={{ padding: '8px 10px', fontSize: '0.85rem' }}>
            <h3 style={{ margin: '0 0 3px 0', fontSize: '0.95rem', fontWeight: '800' }}>{data.client_name}</h3>
            <p style={{ margin: '0 0 3px 0', color: '#444', whiteSpace: 'pre-line' }}>{data.client_address}</p>
            <p style={{ margin: '0', fontWeight: '600' }}>GSTIN : {data.client_gstin}</p>
            <p style={{ margin: '0' }}>State Code : {data.client_state_code || '—'}</p>
            <div style={{ marginTop: '5px' }}>
              <p style={{ margin: '0', color: '#666' }}>Contact : {data.client_phone}</p>
              <p style={{ margin: '0', color: '#666' }}>Email : {data.client_email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reason / Reference Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px', breakInside: 'avoid' }}>
        <div style={{ border: `1px solid ${borderColor}`, borderRadius: '6px', padding: '8px 10px', background: '#fff' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: primaryMaroon, fontWeight: '700', marginBottom: '4px' }}>
             <i className="fas fa-file-alt"></i> REASON FOR CREDIT
           </div>
           <div style={{ fontSize: '0.9rem', color: '#444' }}>{data.reason_for_credit || '—'}</div>
        </div>
        <div style={{ border: `1px solid ${borderColor}`, borderRadius: '6px', padding: '8px 10px', background: '#fff' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: primaryMaroon, fontWeight: '700', marginBottom: '4px' }}>
             <i className="fas fa-calendar-check"></i> REFERENCE
           </div>
           <div style={{ fontSize: '0.9rem', color: '#444' }}>{data.reference || '—'}</div>
        </div>
      </div>

      {/* Items Table */}
      <table ref={itemsRef} style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr style={{ background: primaryMaroon, color: 'white' }}>
            <th style={{ padding: '6px 8px', textAlign: 'center', border: `1px solid ${primaryMaroon}` }}>S.No.</th>
            <th style={{ padding: '6px 8px', textAlign: 'left', border: `1px solid ${primaryMaroon}`, width: hasAnyHSN ? '35%' : '50%' }}>Item Description</th>
            {hasAnyHSN && <th style={{ padding: '6px 8px', textAlign: 'center', border: `1px solid ${primaryMaroon}` }}>HSN/SAC</th>}
            <th style={{ padding: '6px 8px', textAlign: 'center', border: `1px solid ${primaryMaroon}` }}>Qty Returned</th>
            <th style={{ padding: '6px 8px', textAlign: 'right', border: `1px solid ${primaryMaroon}` }}>Unit Price ({currentCurrency.symbol})</th>
            {data.tax_rate > 0 && <th style={{ padding: '6px 8px', textAlign: 'center', border: `1px solid ${primaryMaroon}` }}>Tax %</th>}
            <th style={{ padding: '6px 8px', textAlign: 'right', border: `1px solid ${primaryMaroon}` }}>Amount ({currentCurrency.symbol})</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index} style={{ breakInside: 'avoid' }}>
              <td style={{ padding: '6px 8px', border: '1px solid #ddd', textAlign: 'center' }}>{index + 1}</td>
              <td style={{ padding: '6px 8px', border: '1px solid #ddd', fontWeight: '500' }}>{item.description}</td>
              {hasAnyHSN && <td style={{ padding: '6px 8px', border: '1px solid #ddd', textAlign: 'center' }}>{item.hsn || '—'}</td>}
              <td style={{ padding: '6px 8px', border: '1px solid #ddd', textAlign: 'center' }}>{item.quantity}</td>
              <td style={{ padding: '6px 8px', border: '1px solid #ddd', textAlign: 'right' }}>{fmt(item.unit_price)}</td>
              {data.tax_rate > 0 && <td style={{ padding: '6px 8px', border: '1px solid #ddd', textAlign: 'center' }}>{data.tax_rate}%</td>}
              <td style={{ padding: '6px 8px', border: '1px solid #ddd', textAlign: 'right', fontWeight: '600' }}>{fmt(item.quantity * item.unit_price)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '20px', breakInside: 'avoid' }}>
        <div>
          <div style={{ border: `1px solid ${borderColor}`, borderRadius: '6px', overflow: 'hidden', height: '100%' }}>
            <div style={{ background: '#fdfdfd', padding: '8px 10px', borderBottom: `1px solid ${borderColor}` }}>
              <h4 style={{ margin: '0', fontSize: '0.8rem', fontWeight: '800', color: primaryMaroon }}>AMOUNT IN WORDS</h4>
            </div>
            <div style={{ padding: '12px 10px' }}>
              <p style={{ fontSize: '0.9rem', color: '#333', margin: 0, fontWeight: '700' }}>{numberToWords(total)}</p>
            </div>
          </div>
        </div>
        <div>
          <div style={{ background: '#fff', borderRadius: '6px', border: `1px solid ${borderColor}`, overflow: 'hidden' }}>
            <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: '#444', fontWeight: '600' }}>Total Amount Before Tax</span>
                <span style={{ fontWeight: '700' }}>{currentCurrency.symbol} {fmt(subtotal)}</span>
              </div>
              {taxAmount > 0 && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span style={{ color: '#666' }}>CGST ({(data.tax_rate/2).toFixed(1)}%) Reversal</span>
                    <span style={{ fontWeight: '700' }}>{currentCurrency.symbol} {fmt(taxAmount / 2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span style={{ color: '#666' }}>SGST ({(data.tax_rate/2).toFixed(1)}%) Reversal</span>
                    <span style={{ fontWeight: '700' }}>{currentCurrency.symbol} {fmt(taxAmount / 2)}</span>
                  </div>
                </>
              )}
              {(data.additional_charges || []).filter(c => (parseFloat(c.amount) || 0) !== 0).map((c, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                  <span style={{ color: '#666' }}>{c.label || 'Extra Charge'}</span>
                  <span style={{ fontWeight: '700' }}>{currentCurrency.symbol} {fmt(c.amount)}</span>
                </div>
              ))}
            </div>
            <div style={{ background: primaryMaroon, color: 'white', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '800', fontSize: '1rem' }}>TOTAL CREDIT AMOUNT</span>
              <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{currentCurrency.symbol} {fmt(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '20px', breakInside: 'avoid' }}>
        <div style={{ border: `1px solid ${borderColor}`, borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ background: '#fdfdfd', padding: '6px 10px', borderBottom: `1px solid ${borderColor}`, color: primaryMaroon, fontWeight: '800', fontSize: '0.8rem' }}>NOTES</div>
          <div style={{ padding: '8px 10px', fontSize: '0.85rem', color: '#555', whiteSpace: 'pre-line' }}>{data.notes}</div>
        </div>
        <div style={{ border: `1px solid ${borderColor}`, borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ background: '#fdfdfd', padding: '6px 10px', borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', gap: '6px', color: primaryMaroon, fontWeight: '800', fontSize: '0.8rem' }}>
             <i className="fas fa-university"></i> BANK DETAILS (FOR REFUND, IF APPLICABLE)
          </div>
          <div style={{ padding: '8px 12px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2px 10px', fontSize: '0.85rem' }}>
            <div style={{ color: '#666' }}>Bank Name</div><div>: {data.bank_name || '—'}</div>
            <div style={{ color: '#666' }}>A/C Number</div><div>: {data.bank_account || '—'}</div>
            <div style={{ color: '#666' }}>IFSC Code</div><div>: {data.bank_ifsc || '—'}</div>
            <div style={{ color: '#666' }}>Account Holder</div><div>: {data.sender_name}</div>
            <div style={{ color: '#666' }}>UPI ID</div><div>: {data.upi_id || '—'}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginTop: 'auto', breakInside: 'avoid' }}>
        <div>
          <h4 style={{ margin: '0 0 5px 0', fontSize: '0.85rem', fontWeight: '800', color: primaryMaroon }}>TERMS & CONDITIONS</h4>
          <div style={{ fontSize: '0.75rem', color: '#666', whiteSpace: 'pre-line', lineHeight: '1.4' }}>{data.terms}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
           <h4 style={{ margin: '0 0 40px 0', fontSize: '0.85rem', fontWeight: '800', color: primaryMaroon, textTransform: 'uppercase' }}>AUTHORIZED SIGNATURE</h4>
           <div style={{ borderTop: '1px solid #999', paddingTop: '5px', fontSize: '0.85rem', fontWeight: '700', color: '#444' }}>For {data.sender_name}</div>
        </div>
      </div>

      <div ref={footerRef} style={{ position: 'absolute', bottom: '8px', left: 0, right: 0, textAlign: 'center', fontSize: '0.6rem', color: '#ddd' }}>
        Generated using <strong>DOCUFORGE</strong>
      </div>
    </div>
  )
})

CreditNotePreview.displayName = 'CreditNotePreview'
export default CreditNotePreview
