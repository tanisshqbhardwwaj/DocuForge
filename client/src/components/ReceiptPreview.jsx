import { forwardRef, useImperativeHandle, useRef } from 'react'

const ReceiptPreview = forwardRef(({ user, data, subtotal, taxAmount, total }, ref) => {
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

  const themeColor = data.themeColor || '#455a64'
  const primaryBlue = themeColor
  const borderColor = themeColor + '40'

  const headerRef = useRef(null);
  const itemsRef = useRef(null);
  const totalsRef = useRef(null);
  const footerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    scrollToHeader: () => headerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    scrollToItems: () => itemsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    scrollToTotals: () => totalsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
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
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ width: '45px', height: '45px', background: data.logo_image ? 'transparent' : primaryBlue, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', overflow: 'hidden' }}>
              {data.logo_image ? (
                <img src={data.logo_image} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <i className="fas fa-receipt" style={{ fontSize: '20px' }}></i>
              )}
            </div>
            <div>
              <h1 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#1a1a1a', margin: 0, textTransform: 'uppercase' }}>{data.sender_name || 'YOUR COMPANY'}</h1>
              {data.tagline && <p style={{ fontSize: '0.75rem', color: '#666', margin: 0 }}>{data.tagline}</p>}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: primaryBlue, margin: '-5px 0 5px 0', lineHeight: '1', letterSpacing: '-1px', textTransform: 'uppercase' }}>
            SALES RECEIPT
          </h1>
          <div style={{ display: 'inline-grid', gridTemplateColumns: 'auto auto', gap: '5px 15px', fontSize: '0.9rem', textAlign: 'left', fontWeight: '500' }}>
            <div style={{ fontWeight: '700' }}>Receipt No.</div><div>: {data.doc_number}</div>
            <div style={{ fontWeight: '700' }}>Receipt Date</div><div>: {formatDate(data.date)}</div>
          </div>
        </div>
      </div>

      <div style={{ height: '1.5px', background: '#eee', marginBottom: '20px' }}></div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
        <div style={{ border: `1px solid ${borderColor}`, borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ background: primaryBlue, color: 'white', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '0.8rem' }}>
             RECEIVED FROM
          </div>
          <div style={{ padding: '8px 12px', fontSize: '0.9rem' }}>
            <h3 style={{ margin: '0 0 3px 0', fontSize: '1rem', fontWeight: '800' }}>{data.client_name}</h3>
            <p style={{ margin: '0 0 3px 0', color: '#444', whiteSpace: 'pre-line' }}>{data.client_address}</p>
          </div>
        </div>
        
        <div style={{ border: `1px solid ${borderColor}`, borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ background: primaryBlue, color: 'white', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '0.8rem' }}>
             PAYMENT METHOD
          </div>
          <div style={{ padding: '8px 12px', fontSize: '0.9rem' }}>
            <div style={{ fontWeight: '700', fontSize: '1rem' }}>{data.payment_method || '—'}</div>
            {data.transaction_id && <div style={{ fontSize: '0.85rem', color: '#666' }}>ID: {data.transaction_id}</div>}
          </div>
        </div>
      </div>

      <table ref={itemsRef} style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr style={{ background: primaryBlue, color: 'white' }}>
            <th style={{ padding: '8px', textAlign: 'left', border: `1px solid ${primaryBlue}` }}>S.No.</th>
            <th style={{ padding: '8px', textAlign: 'left', border: `1px solid ${primaryBlue}`, width: '60%' }}>Item Description</th>
            <th style={{ padding: '8px', textAlign: 'right', border: `1px solid ${primaryBlue}` }}>Amount ({currentCurrency.symbol})</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <td style={{ padding: '8px', border: '1px solid #eee', textAlign: 'center' }}>{index + 1}</td>
              <td style={{ padding: '8px', border: '1px solid #eee' }}>{item.description}</td>
              <td style={{ padding: '8px', border: '1px solid #eee', textAlign: 'right' }}>{fmt(item.quantity * item.unit_price)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div ref={totalsRef} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '20px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
        <div>
          <div style={{ border: `1px solid ${borderColor}`, borderRadius: '10px', padding: '10px 12px', background: '#f8fbff', minHeight: '60px' }}>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '0.85rem', fontWeight: '800', color: primaryBlue }}>Total Amount Paid (in Words)</h4>
            <p style={{ fontSize: '0.9rem', color: '#333', margin: 0, fontWeight: '700' }}>{numberToWords(total)}</p>
          </div>
        </div>
        <div>
          <div style={{ background: '#f8fbff', borderRadius: '10px', border: `1px solid ${borderColor}` }}>
            <div style={{ padding: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '900', fontSize: '1.2rem', color: primaryBlue }}>TOTAL PAID</span>
                <span style={{ fontWeight: '900', fontSize: '1.2rem', color: primaryBlue }}>{currentCurrency.symbol} {fmt(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginTop: 'auto', borderTop: '1px solid #eee', paddingTop: '12px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1rem', fontWeight: '700', color: primaryBlue, margin: '10px 0' }}>Thank you for your business!</p>
        </div>
      </div>

      <div ref={footerRef} style={{ position: 'absolute', bottom: '8px', left: 0, right: 0, textAlign: 'center', fontSize: '0.65rem', color: '#ccc' }}>
        Generated using <strong>DOCUFORGE</strong>
      </div>
    </div>
  )
})

ReceiptPreview.displayName = 'ReceiptPreview'
export default ReceiptPreview
