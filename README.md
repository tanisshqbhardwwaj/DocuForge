# DocuForge — Live Document Generator

A professional, Zoho-inspired live document generator for creating GST-compliant Invoices and Payment Orders. Built with a modern dark-mode aesthetic and real-time preview capabilities.

## 🚀 How to Run Locally

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)

### 2. Setup & Installation
Clone the repository and install all dependencies with one command:

```bash
# Install everything (Root, Client, and Server)
npm run install-all
```

### 3. Running the Project
You can now run both the backend and frontend at the same time from the root folder.

**Start both at once:**
```bash
npm run dev
```

Alternatively, you can run them individually:
- **Backend:** `npm run server`
- **Frontend:** `npm run client`

---

## 📄 PDF Generation

### Library Choice: `html2pdf.js`
We chose **`html2pdf.js`** for this project for several key reasons:
- **DOM-to-PDF Fidelity**: It uses `html2canvas` and `jsPDF` under the hood, allowing us to maintain the exact look and feel of our "Live Preview" CSS in the final PDF.
- **Ease of Implementation**: It allows for rapid development by leveraging existing HTML/CSS layouts rather than having to manually draw shapes and text on a PDF canvas.
- **Client-Side Processing**: Generating the PDF on the client reduces server load and provides an instantaneous experience for the user.

**Note on implementation:** To fix standard issues with filename handling and UUID generation, we utilize `.output('blob')` to create a binary object and manually trigger a download with the specific document number.

---

## 🛠 Features & Improvements

### Key Features Implemented:
- **Dual Document Support**: Generate both **TAX INVOICES** and **PAYMENT ORDERS** with a single click.
- **Real-Time Preview**: Watch your document update instantly as you fill the form.
- **Document History**: A dashboard with sorting (Date/Amount), filtering (by type), and read-only viewing.
- **Local Storage Fallback**: Never lose your progress—form data is automatically saved as you type.
- **GST Compliance**: Support for HSN codes, tax breakdowns (CGST/SGST), and Indian currency formatting.

### Known Bugs & Limitations:
- **Image Loading**: Occasionally, high-resolution external images in `html2canvas` can cause rendering delays if not properly cached or if CORS is restricted.
- **Page Breaks**: While `html2pdf` handles basic page breaks, extremely long tables (multi-page) may occasionally require manual CSS `page-break-inside: avoid` tuning for perfect alignment.

### Areas for Future Improvement:
- **Cloud Storage**: Currently, document metadata is saved in SQLite, but the PDF files themselves are generated on-the-fly. Integrating AWS S3 or Google Cloud Storage would allow for persistent PDF links.
- **User Permissions**: Adding roles (Admin, Staff) for larger organizations.
- **Email Integration**: The ability to send the generated PDF directly to the client via SMTP or SendGrid.
- **Template Gallery**: Providing multiple professional themes and layouts beyond the standard Zoho-inspired design.
