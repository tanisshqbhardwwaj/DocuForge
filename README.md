# DocuForge — Smart Billing for Growing Teams 🚀

I built DocuForge because I realized that for most small business owners, generating a professional, GST-compliant invoice feels like a chore. You either use a complex accounting software that costs a fortune, or you struggle with Excel templates that look terrible. 

DocuForge is the "middle ground" — a sleek, professional, and dead-simple document generator that gives you a live preview of exactly what your PDF will look like before you hit download.

---

## Why DocuForge?

*   **Smart GST Logic**: The app automatically knows if you're GST-registered. If you are, it adds HSN codes and CGST/SGST breakdowns. If not, it keeps things clean with a simple tax toggle.
*   **Live Preview**: No more "save and hope it looks good." Every character you type updates the invoice preview in real-time.
*   **Isolated Drafts**: I've made sure that if multiple people use the same computer, their data stays private. Drafts are isolated by user ID and wiped on logout.
*   **Automatic Numbering**: Switch from an "Invoice" to a "Purchase Order" or "Credit Note," and the app intelligently swaps your prefixes (INV-, PO-, CN-) for you.
*   **Zero-Setup Persistence**: Your history and organization profiles are saved securely on a persistent disk (SQLite), so your data is there whenever you come back.

---

## Quick Start (For Developers)

### 1. Grab the dependencies
I've made this easy. Just run one command to install everything for the frontend and backend:
```bash
npm run install-all
```

### 2. Fire it up
This will start your development server and the client together:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) and you're ready to go!

---

## Under the Hood

*   **Frontend**: React + Vanilla CSS (No bulky frameworks, just clean, fast code).
*   **Backend**: Node.js + Express, refactored into a professional **Controller-Service-Repository** pattern.
*   **Database**: SQLite (using `better-sqlite3`). It's fast, portable, and runs on a persistent disk in production.
*   **PDF Magic**: Powered by `html2pdf.js`. It takes the HTML/CSS preview you see on screen and converts it into a high-quality PDF directly in the browser.

---

## Pro Features (Admin)

I've added a secure **Data Explorer** so you can see exactly what's happening in your database without needing a SQL client.
*   **URL**: `/api/admin/view-data`
*   **Safety**: Password-protected and includes a "Nuclear Reset" button if you ever need to clear all data and start fresh.

---

## Roadmap

DocuForge is always evolving. Here's what I'm thinking of adding next:
- **Email Integration**: Send PDFs directly to clients with one click.
- **Supabase Migration**: Moving to a cloud database for even better reliability.
- **Custom Branding**: Letting users upload their own logos for the invoice header.

*Built with ❤️ by a developer who just wanted a better way to bill.*
