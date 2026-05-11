# DocuForge — GST Invoice & Document Generator

I built DocuForge because generating GST-compliant invoices felt way more 
painful than it should be. Fill in a form, see a live preview, download a 
clean PDF. That's it.

🔗 Live App: https://docuforge-xi.vercel.app

---

## Running it locally

You'll need Node.js v20+ and npm installed. Then:

```bash
# 1. Clone the repo
git clone https://github.com/tanisshqbhardwwaj/DocuForge.git
cd DocuForge

# 2. Install everything (root + client + server) in one go
npm run install-all

# 3. Start the app
npm run dev
```

That last command boots both the frontend and backend together. If you ever 
need to run them separately:

```bash
npm run server   # just the backend
npm run client   # just the frontend
```

The frontend runs on localhost:3000 and the backend on localhost:5000 
(check your .env if the ports differ).

---

## How PDF generation works

I went with **html2pdf.js**, which wraps html2canvas and jsPDF under the hood.

The core reason: the live preview you see in the app is plain HTML/CSS. 
html2pdf.js renders that same HTML directly into the PDF, so there's no 
separate "draw everything again on a canvas" step — what you see in the 
preview is genuinely what lands in the file.

It also runs 100% on the client side. No server round-trip, no upload, 
just instant local generation.

One small implementation detail worth noting: I use `.output('blob')` 
instead of the default save-to-file approach. This gives me proper control 
over the filename (tied to the document number) and avoids some weird 
behavior that crept in with UUID-based auto-names.

---

## What it does

- **Invoices, POs, and Credit Notes** — switch between document types; 
  each gets its own form layout and template.
- **GST compliance** — CGST/SGST breakdowns, HSN/SAC codes, 
  Indian number formatting.
- **Live preview** — the preview panel updates as you type. 
  No surprises when you export.
- **Document history** — search, filter, and sort past documents; 
  revenue and pending stats on the dashboard.
- **Email delivery** — send the generated PDF to a client 
  directly from the viewer.
- **Recurring invoices** — set a billing cycle (weekly, monthly, etc.) 
  for repeat clients.

---

## Known bugs & things I'd fix with more time

**Bugs right now:**

- **External images in PDFs** — html2canvas struggles with images loaded 
  from external URLs if CORS headers aren't set right. Base64 or locally 
  hosted images work fine; external ones might render blank or slowly.
  
- **Multi-page tables** — long item lists occasionally get clipped at 
  page breaks. Adding `page-break-inside: avoid` in CSS helps, but it's 
  not bulletproof yet.

- **Cold starts** — the backend runs on Render's free tier, so the first 
  request after inactivity takes ~30 seconds to wake up. Annoying, but 
  it's a hosting cost thing, not a code thing.

**What I'd improve with more time:**

- **Persistent PDF storage** — right now PDFs are generated on the fly 
  and gone once you close the tab. Hooking up S3 or Google Cloud Storage 
  would let you access and share past exports.
  
- **Background recurring jobs** — the recurrence engine sets up the 
  schedule, but there's no worker actually firing those invoices 
  automatically yet. A cron job + email trigger would close that loop.
  
- **Template gallery** — the current template is solid but there's only 
  one. A minimal theme, a bold theme, etc. would make it feel more 
  complete.
  
- **User roles** — right now it's one account = one workspace. 
  Admin/staff separation would make it usable for small teams.

---

## Try it with test data

If you want to see the app with everything already filled in:

- Email: `test@docuforge.com`  
- Password: `password123`

This account has sample invoices, POs, and credit notes preloaded.
