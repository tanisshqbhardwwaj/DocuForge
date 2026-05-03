const db = require('../db');

class DocumentRepository {
  static create(docData) {
    const d = docData;
    const result = db.prepare(`
      INSERT INTO documents (
        user_id, doc_type, doc_number, title, date, due_date,
        sender_name, sender_address, sender_email, sender_phone, sender_gstin,
        client_name, client_address, client_email, client_phone, client_gstin,
        place_of_supply, payment_terms, items, subtotal, tax_rate,
        tax_amount, total, discount, notes, terms,
        bank_name, bank_account, bank_ifsc, bank_branch,
        payment_status, payment_method, transaction_id,
        po_number, po_date, shipping_date, transport_mode, transport_name, sales_person
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      d.user_id, 
      d.doc_type || 'invoice', 
      d.doc_number || '', 
      d.title || 'INVOICE', 
      d.date || '', 
      d.due_date || '',
      d.sender_name || '', 
      d.sender_address || '', 
      d.sender_email || '', 
      d.sender_phone || '', 
      d.sender_gstin || '',
      d.client_name || '', 
      d.client_address || '', 
      d.client_email || '', 
      d.client_phone || '', 
      d.client_gstin || '',
      d.place_of_supply || '', 
      d.payment_terms || 'Net 30', 
      JSON.stringify(d.items || []),
      d.subtotal || 0, 
      d.tax_rate || 0, 
      d.tax_amount || 0, 
      d.total || 0, 
      d.discount || 0, 
      d.notes || '', 
      d.terms || '',
      d.bank_name || '', 
      d.bank_account || '', 
      d.bank_ifsc || '', 
      d.bank_branch || '',
      d.payment_status || 'unpaid',
      d.payment_method || '',
      d.transaction_id || '',
      d.po_number || '',
      d.po_date || '',
      d.shipping_date || '',
      d.transport_mode || '',
      d.transport_name || '',
      d.sales_person || ''
    );
    return result.lastInsertRowid;
  }

  static findByUserId(userId) {
    return db.prepare('SELECT * FROM documents WHERE user_id = ? ORDER BY created_at DESC').all(userId);
  }

  static findByIdAndUser(id, userId) {
    return db.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?').get(id, userId);
  }

  static delete(id, userId) {
    return db.prepare('DELETE FROM documents WHERE id = ? AND user_id = ?').run(id, userId);
  }

  static updatePaymentStatus(id, userId, status, method, txId) {
    return db.prepare(`
      UPDATE documents SET
        payment_status = ?,
        payment_method = ?,
        transaction_id = ?
      WHERE id = ? AND user_id = ?
    `).run(status, method || '', txId || '', id, userId);
  }

  static findAll() {
    return db.prepare('SELECT * FROM documents ORDER BY created_at DESC').all();
  }
}

module.exports = DocumentRepository;
