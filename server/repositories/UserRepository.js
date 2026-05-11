const db = require("../db");

class UserRepository {
  static findByEmail(email) {
    return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  }

  static findById(id) {
    return db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  }

  static create(userData) {
    const { company_name, email, phone, password_hash } = userData;
    const result = db
      .prepare(
        `
      INSERT INTO users (company_name, email, phone, password_hash)
      VALUES (?, ?, ?, ?)
    `,
      )
      .run(company_name || "", email, phone || "", password_hash);
    return result.lastInsertRowid;
  }

  static updateOrganization(userId, orgData) {
    const d = orgData;
    return db
      .prepare(
        `
      UPDATE users SET
        org_setup_complete = 1,
        org_name = ?, org_location = ?, org_state = ?,
        org_currency = ?, org_fiscal_year = ?, org_language = ?,
        org_timezone = ?, org_gst_registered = ?, org_gstin = ?,
        org_address = ?, org_phone = ?, org_email = ?,
        org_industry = ?, org_logo = ?,
        org_bank_name = ?, org_bank_account = ?, org_bank_ifsc = ?,
        org_bank_branch = ?, org_tagline = ?, org_website = ?,
        org_upi_id = ?, org_qr_code = ?, org_theme_color = ?
      WHERE id = ?
    `,
      )
      .run(
        d.org_name || "",
        d.org_location || "India",
        d.org_state || "",
        d.org_currency || "INR - Indian Rupee",
        d.org_fiscal_year || "April - March",
        d.org_language || "English",
        d.org_timezone || "(GMT 5:30) India Standard Time",
        d.org_gst_registered ? 1 : 0,
        d.org_gstin || "",
        d.org_address || "",
        d.org_phone || "",
        d.org_email || "",
        d.org_industry || "",
        d.org_logo || "",
        d.org_bank_name || "",
        d.org_bank_account || "",
        d.org_bank_ifsc || "",
        d.org_bank_branch || "",
        d.org_tagline || "",
        d.org_website || "",
        d.org_upi_id || "",
        d.org_qr_code || "",
        d.org_theme_color || "#0055d4",
        userId,
      );
  }

  static findAll() {
    return db.prepare("SELECT * FROM users ORDER BY created_at DESC").all();
  }
}

module.exports = UserRepository;
