const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware } = require('./auth');

// All document routes require authentication
router.use(authMiddleware);

// GET /api/documents — Retrieve all documents for current user
router.get('/', (req, res) => {
  try {
    const docs = db.prepare(
      'SELECT * FROM documents WHERE user_id = ? ORDER BY created_at DESC'
    ).all(req.userId);

    const parsed = docs.map(doc => ({
      ...doc,
      items: JSON.parse(doc.items || '[]')
    }));

    res.json(parsed);
  } catch (err) {
    console.error('GET /api/documents error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/documents/:id
router.get('/:id', (req, res) => {
  try {
    const doc = db.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    doc.items = JSON.parse(doc.items || '[]');
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/documents — Save a new document
router.post('/', (req, res) => {
  try {
    const d = req.body;

    const stmt = db.prepare(`
      INSERT INTO documents
        (user_id, doc_type, doc_number, title, date, due_date,
         sender_name, sender_address, sender_email, sender_phone, sender_gstin,
         client_name, client_address, client_email, client_phone, client_gstin,
         place_of_supply, payment_terms, items, subtotal, tax_rate, tax_amount, total,
         discount, notes, terms, bank_name, bank_account, bank_ifsc, bank_branch)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      req.userId,
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
      d.bank_branch || ''
    );

    const saved = db.prepare('SELECT * FROM documents WHERE id = ?').get(result.lastInsertRowid);
    saved.items = JSON.parse(saved.items || '[]');

    res.status(201).json(saved);
  } catch (err) {
    console.error('POST /api/documents error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/documents/:id
router.delete('/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM documents WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
    if (result.changes === 0) return res.status(404).json({ error: 'Document not found' });
    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
