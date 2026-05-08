const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/documents", require("./routes/documents"));
app.use("/api/admin", require("./routes/admin"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(
    `\n  ⚡ DocuForge API server running at http://localhost:${PORT}`,
  );
  console.log(`  🔐 POST /api/auth/signup     — Register`);
  console.log(`  🔐 POST /api/auth/login      — Login`);
  console.log(`  👤 GET  /api/auth/me          — Profile`);
  console.log(`  🏢 PUT  /api/auth/organization — Org setup`);
  console.log(`  📄 POST /api/documents        — Save document`);
  console.log(`  📋 GET  /api/documents         — List documents\n`);
});
