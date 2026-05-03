# DocuForge — Smart Billing for Growing Teams 🚀

I built DocuForge because I realized that for most small business owners, generating professional, GST-compliant invoices feels like a chore. DocuForge is a sleek, professional document generator that gives you a live preview of exactly what your PDF will look like before you hit download.

---

## 🛠 Tech Stack

- **Frontend**: React.js with Vanilla CSS (Clean, fast, and no bulky frameworks).
- **Backend**: Node.js + Express.js (Refactored into a professional Controller-Service-Repository pattern).
- **Database**: SQLite (using `better-sqlite3`). Chosen for its zero-maintenance, high speed, and local portability.
- **Infrastructure**: Hosted on Render with **Persistent Disk** storage to ensure data remains secure across restarts.

---

## 🚀 How to Run Locally

### 1. Install Dependencies
I have set up a root-level script to install everything for both the frontend and backend in one shot:
```bash
npm run install-all
```

### 2. Start the Project
To run both the **Client** and **Server** concurrently:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 PDF Generation Logic

For PDF generation, I chose **`html2pdf.js`**.

**Why this library?**
*   **What You See Is What You Get**: It converts the actual HTML/CSS from the live preview directly into a PDF. This ensures the design stays 100% consistent.
*   **Client-Side Processing**: It runs entirely in the user's browser. This reduces server load and makes the generation feel instant for the user.
*   **Ease of Use**: It combines `html2canvas` (for rendering) and `jsPDF` (for generating the document) into a single, reliable workflow.

---

## 🐛 Known Bugs & Future Improvements

### Known Issues:
- **Image Loading**: High-resolution external images can sometimes be slow to render in the PDF if the browser's memory is low.
- **Large Tables**: Invoices with 50+ line items may occasionally experience page-break issues (though it works perfectly for standard business use).

### With more time, I would:
- **Cloud Storage**: Move PDFs to a cloud bucket (like AWS S3) instead of generating them on-the-fly.
- **Email Delivery**: Integrate an SMTP server to allow users to email invoices directly to clients from the dashboard.
- **Supabase Migration**: Move from SQLite to Supabase for a more scalable, cloud-native database experience.

---

## 🔐 Admin Panel
I've included a secure **Data Explorer** for managing the live database:
- **URL**: `/api/admin/view-data`
- **Password**: `!@#Tanishq`

*Built with ❤️ by a developer who just wanted a better way to bill.*
