# DocuForge — Live Document Generator

I built this because generating GST-compliant invoices and payment orders felt way more painful than it should be. DocuForge lets you fill a form and get a real, properly formatted PDF out the other end — live preview included, so you're not flying blind.



---

## Getting Started

### Prerequisites
- Node.js v18+
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

## Features

- **Tax Invoices + Payment Orders** — both document types supported, switchable from the same form
- **Live preview** — updates as you type, no save button needed
- **Document history** — sortable by date or amount, filterable by type, with read-only viewing for past docs
- **Auto-save** — form data persists in localStorage, so a refresh won't wipe your work
- **GST compliance** — HSN codes, CGST/SGST breakdowns, Indian currency formatting

---

## Known Issues

- **External images**: `html2canvas` can choke on high-res images from external URLs, especially if CORS is an issue. Images may render slowly or not at all.
- **Long tables**: Multi-page tables sometimes need a nudge with `page-break-inside: avoid` in CSS to render cleanly across pages. Works fine for most typical invoices.
- **Render Free Tier**: Since the project is deployed on the free version of Render, there may be a delay (spin-up time) when first visiting the site. Additionally, data might occasionally be lost due to the ephemeral nature of the free tier storage model.

---

## What's Missing (Roadmap-ish)

These didn't make the cut for now, but they're the obvious next steps:

- **Cloud PDF storage** — Right now PDFs are generated on the fly and not stored. Hooking up S3 or GCS would let you share persistent links.
- **User roles** — Admin/Staff separation for teams with multiple people generating docs.
- **Email delivery** — Send the PDF directly from the app via SMTP or SendGrid.
- **More templates** — A template gallery would open it up considerably.
