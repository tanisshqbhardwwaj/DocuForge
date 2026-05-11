export default function ReceiptForm({
  user, formData, onChange, onItemChange, onAddItem, onRemoveItem,
  onFocusSection, total
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
    <div className="document-form">
      <section className="form-section glass-card">
        <h2 className="section-title"><i className="fas fa-receipt"></i> Receipt Details</h2>
        <div className="form-grid cols-2">
          <div className="form-group">
            <label>Receipt Number</label>
            <input type="text" className="form-input"
              value={formData.doc_number} onChange={e => onChange('doc_number', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" className="form-input"
              value={formData.date} onChange={e => onChange('date', e.target.value)} />
          </div>
        </div>
      </section>

      <section className="form-section glass-card">
        <h2 className="section-title"><i className="fas fa-user"></i> Received From</h2>
        <div className="form-grid cols-2">
          <div className="form-group full-width">
            <label>Customer Name</label>
            <input type="text" className="form-input"
              value={formData.client_name} onChange={e => onChange('client_name', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Payment Method</label>
            <select className="form-input" value={formData.payment_method} onChange={e => onChange('payment_method', e.target.value)}>
              <option value="Cash">Cash</option>
              <option value="Online">Online (UPI/Card)</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
          <div className="form-group">
            <label>Transaction ID (if any)</label>
            <input type="text" className="form-input"
              value={formData.transaction_id} onChange={e => onChange('transaction_id', e.target.value)} />
          </div>
        </div>
      </section>

      <section className="form-section glass-card">
        <div className="section-header-row">
          <h2 className="section-title"><i className="fas fa-list"></i> Items</h2>
          <button className="btn btn-sm btn-add" onClick={onAddItem}>
            <i className="fas fa-plus"></i> Add
          </button>
        </div>
        {formData.items.map((item, index) => (
          <div key={index} className="item-card">
            <div className="form-group full-width">
              <label>Description</label>
              <input type="text" className="form-input"
                value={item.description} onChange={e => onItemChange(index, 'description', e.target.value)} />
            </div>
            <div className="form-grid cols-2" style={{ marginTop: '10px' }}>
              <div className="form-group">
                <label>Amount</label>
                <input type="text" className="form-input"
                  value={item.unit_price} onChange={e => onItemChange(index, 'unit_price', e.target.value)} />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                <button className="btn-icon btn-remove" onClick={() => onRemoveItem(index)}>
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="form-section glass-card">
        <div className="total-row total-final" style={{ fontSize: '1.5rem', fontWeight: '900' }}>
          <span>Total Received:</span>
          <span>{fmt(total)}</span>
        </div>
      </section>
    </div>
  )
}
