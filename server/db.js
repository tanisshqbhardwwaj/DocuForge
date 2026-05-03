const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, 'docuforge.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name TEXT DEFAULT '',
    email TEXT UNIQUE NOT NULL,
    phone TEXT DEFAULT '',
    password_hash TEXT NOT NULL,
    org_setup_complete INTEGER DEFAULT 0,
    org_name TEXT DEFAULT '',
    org_location TEXT DEFAULT 'India',
    org_state TEXT DEFAULT '',
    org_currency TEXT DEFAULT 'INR - Indian Rupee',
    org_fiscal_year TEXT DEFAULT 'April - March',
    org_language TEXT DEFAULT 'English',
    org_timezone TEXT DEFAULT '(GMT 5:30) India Standard Time',
    org_gst_registered INTEGER DEFAULT 0,
    org_gstin TEXT DEFAULT '',
    org_address TEXT DEFAULT '',
    org_phone TEXT DEFAULT '',
    org_email TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    doc_type TEXT DEFAULT 'invoice',
    doc_number TEXT NOT NULL,
    title TEXT DEFAULT 'INVOICE',
    date TEXT DEFAULT '',
    due_date TEXT DEFAULT '',
    sender_name TEXT DEFAULT '',
    sender_address TEXT DEFAULT '',
    sender_email TEXT DEFAULT '',
    sender_phone TEXT DEFAULT '',
    sender_gstin TEXT DEFAULT '',
    client_name TEXT DEFAULT '',
    client_address TEXT DEFAULT '',
    client_email TEXT DEFAULT '',
    client_phone TEXT DEFAULT '',
    client_gstin TEXT DEFAULT '',
    place_of_supply TEXT DEFAULT '',
    payment_terms TEXT DEFAULT 'Net 30',
    items TEXT DEFAULT '[]',
    subtotal REAL DEFAULT 0,
    tax_rate REAL DEFAULT 0,
    tax_amount REAL DEFAULT 0,
    total REAL DEFAULT 0,
    discount REAL DEFAULT 0,
    notes TEXT DEFAULT '',
    terms TEXT DEFAULT '',
    bank_name TEXT DEFAULT '',
    bank_account TEXT DEFAULT '',
    bank_ifsc TEXT DEFAULT '',
    bank_branch TEXT DEFAULT '',
    payment_status TEXT DEFAULT 'unpaid',
    payment_method TEXT DEFAULT '',
    transaction_id TEXT DEFAULT '',
    po_number TEXT DEFAULT '',
    po_date TEXT DEFAULT '',
    shipping_date TEXT DEFAULT '',
    transport_mode TEXT DEFAULT '',
    transport_name TEXT DEFAULT '',
    sales_person TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  // Migration for shipping/logistics fields
  const docCols = db.prepare("PRAGMA table_info(documents)").all();
  const hasPo = docCols.some(c => c.name === 'po_number');
  if (!hasPo) {
    db.prepare("ALTER TABLE documents ADD COLUMN po_number TEXT DEFAULT ''").run();
    db.prepare("ALTER TABLE documents ADD COLUMN po_date TEXT DEFAULT ''").run();
    db.prepare("ALTER TABLE documents ADD COLUMN shipping_date TEXT DEFAULT ''").run();
    db.prepare("ALTER TABLE documents ADD COLUMN transport_mode TEXT DEFAULT ''").run();
    db.prepare("ALTER TABLE documents ADD COLUMN transport_name TEXT DEFAULT ''").run();
    db.prepare("ALTER TABLE documents ADD COLUMN sales_person TEXT DEFAULT ''").run();
  }
`);

// Add columns to existing tables (safe — errors silently if columns already exist)
const newColumns = [
  ['documents', 'sender_gstin', "TEXT DEFAULT ''"],
  ['documents', 'client_gstin', "TEXT DEFAULT ''"],
  ['documents', 'place_of_supply', "TEXT DEFAULT ''"],
  ['documents', 'payment_terms', "TEXT DEFAULT 'Net 30'"],
  ['documents', 'discount', 'REAL DEFAULT 0'],
  ['documents', 'bank_name', "TEXT DEFAULT ''"],
  ['documents', 'bank_account', "TEXT DEFAULT ''"],
  ['documents', 'bank_ifsc', "TEXT DEFAULT ''"],
  ['documents', 'bank_branch', "TEXT DEFAULT ''"],
  ['documents', 'payment_status', "TEXT DEFAULT 'unpaid'"],
  ['documents', 'payment_method', "TEXT DEFAULT ''"],
  ['documents', 'transaction_id', "TEXT DEFAULT ''"],
];

for (const [table, col, type] of newColumns) {
  try {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${type}`);
  } catch {
    // Column already exists — ignore
  }
}

module.exports = db;
