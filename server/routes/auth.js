const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'docuforge_secret_key_2026';

// Middleware to verify JWT
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token provided' });

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { company_name, email, phone, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const result = db.prepare(`
      INSERT INTO users (company_name, email, phone, password_hash)
      VALUES (?, ?, ?, ?)
    `).run(company_name || '', email, phone || '', password_hash);

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    const { password_hash: _, ...safeUser } = user;
    res.status(201).json({ token, user: safeUser });
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    const { password_hash: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me — get current user profile
router.get('/me', authMiddleware, (req, res) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { password_hash: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/auth/organization — save organization details
router.put('/organization', authMiddleware, (req, res) => {
  try {
    const d = req.body;
    db.prepare(`
      UPDATE users SET
        org_setup_complete = 1,
        org_name = ?, org_location = ?, org_state = ?,
        org_currency = ?, org_fiscal_year = ?, org_language = ?,
        org_timezone = ?, org_gst_registered = ?, org_gstin = ?,
        org_address = ?, org_phone = ?, org_email = ?
      WHERE id = ?
    `).run(
      d.org_name || '', d.org_location || 'India', d.org_state || '',
      d.org_currency || 'INR - Indian Rupee', d.org_fiscal_year || 'April - March',
      d.org_language || 'English', d.org_timezone || '(GMT 5:30) India Standard Time',
      d.org_gst_registered ? 1 : 0, d.org_gstin || '',
      d.org_address || '', d.org_phone || '', d.org_email || '',
      req.userId
    );

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
    const { password_hash: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
module.exports.authMiddleware = authMiddleware;
