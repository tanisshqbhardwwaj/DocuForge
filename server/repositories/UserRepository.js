const db = require('../db');

class UserRepository {
  static findByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  }

  static findById(id) {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  }

  static create(userData) {
    const { company_name, email, phone, password_hash } = userData;
    const result = db.prepare(`
      INSERT INTO users (company_name, email, phone, password_hash)
      VALUES (?, ?, ?, ?)
    `).run(company_name || '', email, phone || '', password_hash);
    return result.lastInsertRowid;
  }

  static updateOrganization(userId, orgData) {
    const d = orgData;
    return db.prepare(`
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
      userId
    );
  }
}

module.exports = UserRepository;
