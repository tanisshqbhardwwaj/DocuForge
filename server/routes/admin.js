const express = require('express');
const UserRepository = require('../repositories/UserRepository');
const DocumentRepository = require('../repositories/DocumentRepository');

const router = express.Router();
const ADMIN_PASSWORD = '!@#Tanishq';

router.get('/view-data', (req, res) => {
  const { password } = req.query;

  if (password !== ADMIN_PASSWORD) {
    return res.status(403).send(`
      <html>
        <body style="background: #0f172a; color: white; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh;">
          <form method="GET" style="background: rgba(255,255,255,0.05); padding: 40px; border-radius: 12px; text-align: center;">
            <h2 style="margin-bottom: 20px;">Admin Access Required</h2>
            <input type="password" name="password" placeholder="Enter Password" style="padding: 10px; border-radius: 4px; border: 1px solid #334155; background: #1e293b; color: white; margin-bottom: 20px; width: 100%;"><br/>
            <button type="submit" style="background: #7c3aed; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">View Data</button>
          </form>
        </body>
      </html>
    `);
  }

  try {
    const users = UserRepository.findAll().map(u => {
      const { password_hash, ...rest } = u;
      return rest;
    });
    const documents = DocumentRepository.findAll().map(d => ({
      ...d,
      items: JSON.parse(d.items || '[]')
    }));

    res.send(`
      <html>
        <head>
          <title>DocuForge Admin Panel</title>
          <style>
            body { background: #0f172a; color: #e2e8f0; font-family: sans-serif; padding: 40px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; background: #1e293b; border-radius: 8px; overflow: hidden; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #334155; }
            th { background: #334155; color: white; }
            h1 { color: #7c3aed; }
            .badge { background: #7c3aed; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; }
          </style>
        </head>
        <body>
          <h1>DocuForge Database Explorer</h1>
          
          <h2>Users (${users.length})</h2>
          <table>
            <thead>
              <tr><th>ID</th><th>Company</th><th>Email</th><th>GST Status</th><th>Created</th></tr>
            </thead>
            <tbody>
              ${users.map(u => `
                <tr>
                  <td>${u.id}</td>
                  <td>${u.org_name || u.company_name}</td>
                  <td>${u.email}</td>
                  <td>${u.org_gst_registered ? '<span class="badge">GST</span>' : 'Standard'}</td>
                  <td>${u.created_at}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h2>Documents (${documents.length})</h2>
          <table>
            <thead>
              <tr><th>ID</th><th>User ID</th><th>Type</th><th>Number</th><th>Total</th><th>Created</th></tr>
            </thead>
            <tbody>
              ${documents.map(d => `
                <tr>
                  <td>${d.id}</td>
                  <td>${d.user_id}</td>
                  <td>${d.doc_type}</td>
                  <td>${d.doc_number}</td>
                  <td>₹${d.total.toFixed(2)}</td>
                  <td>${d.created_at}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send("Error fetching data: " + err.message);
  }
});

module.exports = router;
