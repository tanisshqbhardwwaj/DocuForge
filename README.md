# DocuForge — Professional GST Invoice & Document Generator

I built this because generating GST-compliant invoices and purchase orders felt way more painful than it should be. DocuForge lets you fill a form and get a real, properly formatted PDF out the other end — live preview included, so you're not flying blind.

🔗 **Live App:** [docuforge-xi.vercel.app](https://docuforge-xi.vercel.app)

---

## Getting Started

### Prerequisites

- Node.js v20+
- npm (ships with Node)

### Install

```bash
# Installs dependencies for root, client, and server in one shot
npm run install-all
```

### Run

```bash
npm run dev
```

This starts both the backend and frontend together. If you need them separately:

```bash
npm run server   # backend only
npm run client   # frontend only
```

---

## PDF Generation

We're using **`html2pdf.js`**, which combines `html2canvas` and `jsPDF` under the hood.

The main reason we went with it: the live preview in the app is just HTML/CSS, and `html2pdf.js` renders that directly into the PDF. No manually re-drawing text and shapes on a canvas — what you see in the preview is (mostly) what you get in the file.

It also runs entirely on the client, so no server round-trips for PDF generation.

One implementation note: we use `.output('blob')` instead of the default filename approach. This gives us proper control over the filename (tied to the document number) and sidesteps some quirky behavior with UUID-based names.

---

---

## Features

- **Unified Billing Suite** — Seamlessly switch between **Invoices**, **Purchase Orders**, and **Credit Notes**. Each document type has its own specialized form and professional template.
- **Recurring Invoices** — Built-in recurrence engine (Weekly, Monthly, Quarterly, etc.) to handle automated future billing cycles for regular clients.
- **High-Density "Zoho" UI** — Professionally compact, glassmorphism-inspired interface designed for enterprise data entry. Shrinkable headers and optimized grid layouts maximize screen real estate.
- **GST & HSN Compliance** — Automatic tax breakdowns (CGST/SGST), HSN/SAC code tracking, and GST-compliant total calculations.
- **Email Delivery** — Send generated documents directly to clients from the document viewer using the integrated mail service.
- **Live Preview & PDF Export** — Real-time rendering with A4-calibrated PDF generation using `html2pdf.js`. What you see is exactly what you get.
- **Document History & Stats** — Track your revenue and pending bills with a dedicated History dashboard, featuring advanced search, filtering, and sorting.

---

## Testing & Review

To test the application with pre-populated data (all columns filled), use the following test account:

- **Email:** `test@docuforge.com`
- **Password:** `password123`

This account includes sample Invoices, POs, and Credit Notes to demonstrate the conditional rendering and dashboard analytics.

---

## Known Issues

- **External images**: `html2canvas` can sometimes struggle with high-res external images due to CORS. Local or base64 images work best.
- **Cold Starts**: The backend is hosted on a free tier, so the first request might take a moment to wake up the server.

---

## Roadmap

- **Recurring Automation** — Implement a background worker to automatically generate and email scheduled recurring invoices.
- **Cloud Storage** — Permanent PDF hosting on AWS S3 or Google Cloud Storage.
- **Template Gallery** — Multiple professional themes (Modern, Minimal, Bold, etc.) for every document type.
- **Inventory Sync** — Track item stock levels automatically when invoices or POs are issued.

