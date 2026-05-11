import { useState, useRef, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import InvoiceForm from "../components/InvoiceForm";
import InvoicePreview from "../components/InvoicePreview";
import ReceiptForm from "../components/ReceiptForm";
import ReceiptPreview from "../components/ReceiptPreview";
import POForm from "../components/POForm";
import POPreview from "../components/PurchaseOrderPreview";
import CreditNoteForm from "../components/CreditNoteForm";
import CreditNotePreview from "../components/CreditNotePreview";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";

export default function Generator() {
  const { user, authFetch } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const STORAGE_KEY = `docuforge_draft_${user?.id || "anon"}`;

  // --- INITIALIZATION & DEFAULT STATES ---
  const defaultState = () => ({
    title: "INVOICE",
    doc_number: `INV-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],

    // Header Branding
    tagline: user?.org_tagline || "",
    website: user?.org_website || "",

    // Sender Details
    sender_name: user?.org_name || user?.company_name || "",
    sender_address: user?.org_address || "",
    sender_email: user?.org_email || user?.email || "",
    sender_phone: user?.org_phone || user?.phone || "",
    sender_gstin: user?.org_gstin || "",

    // Bill To (Client)
    client_name: "",
    client_address: "",
    client_email: "",
    client_phone: "",
    client_gstin: "",
    client_state_code: "",

    // Ship To
    shipping_name: "",
    shipping_address: "",
    shipping_phone: "",
    shipping_gstin: "",
    shipping_state_code: "",

    place_of_supply: user?.org_state || "",
    payment_terms: "Net 15 Days",
    different_shipping: false,
    items: [{ description: "", quantity: 1, unit_price: 0, hsn: "", discount: 0, unit: "" }],
    tax_rate: user?.org_gst_registered ? 18 : 0,
    show_tax_field: true,
    discount: 0,
    themeColor: localStorage.getItem('docuforge_last_theme') || user?.org_theme_color || "#0055d4",
    notes: "",
    terms: "1. Payment to be made within the due date mentioned above.\n2. Late payments may attract applicable interest charges.\n3. Goods once sold will not be taken back or exchanged.",

    // Bank & Payment
    bank_name: user?.org_bank_name || "",
    bank_account: user?.org_bank_account || "",
    bank_ifsc: user?.org_bank_ifsc || "",
    upi_id: user?.org_upi_id || "",
    qr_code_image: user?.org_qr_code || "",
    logo_image: user?.org_logo || "",

    // Credit Note specific
    related_invoice_number: "",
    related_invoice_date: "",
    reason_for_credit: "",
    reference: "",

    currency: "INR",
    additional_charges: [],
    payment_status: "unpaid",
    payment_method: "",
    transaction_id: "",

    // Recurring Invoice
    is_recurring: false,
    recurrence_frequency: "monthly",
    recurrence_start_date: "",
    recurrence_end_date: "",
    recurrence_count: 0,
  });

  const getInitialState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultState(), ...parsed };
      }
    } catch {
      /* ignore corrupt data */
    }
    return defaultState();
  };

  const [formData, setFormData] = useState(getInitialState);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const previewRef = useRef(null);

  // Auto-select type from Dashboard quick create
  useEffect(() => {
    if (location.state?.type && !selectedType) {
      selectType(location.state.type);
      // Clear the state so it doesn't re-trigger
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const selectType = (type) => {
    const currentTheme = formData.themeColor;
    const fresh = defaultState();
    fresh.themeColor = currentTheme; // Preserve the last used theme

    if (type === "po") {
      fresh.title = "PURCHASE ORDER";
      fresh.doc_number = `PO-${String(Math.floor(Math.random() * 9000) + 1000)}`;
      fresh.notes = "Please ensure the goods are securely packed and delivered to the address mentioned above.\nFor any queries, contact the person mentioned above.";
      fresh.terms = "1. Delivery to be made on or before the expected delivery date.\n2. Payment will be made within 30 days from the date of delivery and acceptance of goods.\n3. Please mention PO Number on all invoices and documents.\n4. Goods must be of good quality and as per the specifications mentioned.\n5. In case of any discrepancies, inform us within 7 days of delivery.";
    } else if (type === "receipt") {
      fresh.title = "SALES RECEIPT";
      fresh.doc_number = `RCP-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    } else if (type === "credit_note") {
      fresh.title = "CREDIT NOTE";
      fresh.doc_number = `CN-${String(Math.floor(Math.random() * 9000) + 1000)}`;
      fresh.notes = "The above amount will be adjusted in your next invoice or refunded as per our agreement.";
      fresh.terms = "";
    } else {
      fresh.title = "INVOICE";
      // doc_number is already set to INV-xxx in defaultState()
    }
    setFormData(fresh);
    setSelectedType(type);
  };

  useEffect(() => {
    try {
      if (user && selectedType) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...formData, selectedType }));
      }
    } catch {
      /* quota exceeded */
    }
  }, [formData, STORAGE_KEY, user, selectedType]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        sender_name: user.org_name || user.company_name || prev.sender_name,
        sender_address: user.org_address || prev.sender_address,
        sender_phone: user.org_phone || user.phone || prev.sender_phone,
        sender_email: user.org_email || user.email || prev.sender_email,
        sender_gstin: user.org_gstin || prev.sender_gstin,
        tagline: user.org_tagline || prev.tagline,
        website: user.org_website || prev.website,
        bank_name: user.org_bank_name || prev.bank_name,
        bank_account: user.org_bank_account || prev.bank_account,
        bank_ifsc: user.org_bank_ifsc || prev.bank_ifsc,
        upi_id: user.org_upi_id || prev.upi_id,
        qr_code_image: user.org_qr_code || prev.qr_code_image,
        logo_image: user.org_logo || prev.logo_image,
        place_of_supply: user.org_state || prev.place_of_supply,
        tax_rate: user.org_gst_registered ? 18 : prev.tax_rate,
        themeColor: user.org_theme_color || prev.themeColor
      }));
    }
  }, [user]);

  useEffect(() => {
    // We don't auto-restore selectedType anymore so Home always goes to landing page.
  }, []);

    const subtotal = formData.items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unit_price;
      const itemDiscount = itemTotal * ((item.discount || 0) / 100);
      return sum + (itemTotal - itemDiscount);
    }, 0);
    const discountAmount = subtotal * ((formData.discount || 0) / 100);
    const taxableAmount = subtotal - discountAmount;
    const applyTax = !!user?.org_gst_registered || formData.show_tax_field;
    const taxAmount = applyTax ? taxableAmount * ((formData.tax_rate || 0) / 100) : 0;
    const extraChargesTotal = (formData.additional_charges || []).reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
    const total = taxableAmount + taxAmount + extraChargesTotal;

    const calcDueDate = (invoiceDate, terms) => {
      const base = new Date(invoiceDate);
      if (isNaN(base.getTime())) return "";
      let days = 30;
      if (terms === "Due on Receipt" || terms === "No Due") days = 0;
      else {
        const match = terms?.match(/Net\s+(\d+)/);
        if (match) days = parseInt(match[1], 10);
      }
      base.setDate(base.getDate() + days);
      return base.toISOString().split("T")[0];
    };

    const handleFocusSection = useCallback((section) => {
      if (!previewRef.current) return;
      if (section === 'header') previewRef.current.scrollToHeader();
      else if (section === 'items') previewRef.current.scrollToItems();
      else if (section === 'totals') previewRef.current.scrollToTotals();
      else if (section === 'bank') previewRef.current.scrollToBank();
      else if (section === 'footer') previewRef.current.scrollToFooter();
    }, []);

    const handleChange = useCallback((field, value) => {
      setFormData((prev) => {
        const next = { ...prev, [field]: value };
        
        // Auto-switch payment terms to "No Due" if marked as paid
        if (field === 'payment_status' && value === 'paid') {
          next.payment_terms = 'No Due';
        }

        if (field === 'themeColor') {
          localStorage.setItem('docuforge_last_theme', value);
        }
        if (field === "payment_terms") next.due_date = calcDueDate(prev.date, value);
        else if (field === "date") next.due_date = calcDueDate(value, prev.payment_terms);

        if (field === "title") {
          const numOnly = prev.doc_number.replace(/^(INV-|PO-|RCP-|PI-|CN-)/, "");
          if (value === "PURCHASE ORDER") next.doc_number = `PO-${numOnly}`;
          else if (value === "SALES RECEIPT") next.doc_number = `RCP-${numOnly}`;
          else next.doc_number = `INV-${numOnly}`;
        }
        return next;
      });
    }, []);

    const handleItemChange = useCallback((index, field, value) => {
      setFormData((prev) => {
        const items = [...prev.items];
        items[index] = { ...items[index], [field]: value };
        return { ...prev, items };
      });
    }, []);

    const addItem = useCallback(() => {
      setFormData((prev) => ({
        ...prev,
        items: [...prev.items, { description: "", quantity: 1, unit_price: 0, hsn: "", discount: 0, unit: "" }],
      }));
    }, []);

    const removeItem = useCallback((index) => {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    }, []);

    const addCharge = useCallback(() => {
      setFormData((prev) => ({
        ...prev,
        additional_charges: [...(prev.additional_charges || []), { label: "", amount: 0 }],
      }));
    }, []);

    const removeCharge = useCallback((index) => {
      setFormData((prev) => ({
        ...prev,
        additional_charges: prev.additional_charges.filter((_, i) => i !== index),
      }));
    }, []);

    const handleChargeChange = useCallback((index, field, value) => {
      setFormData((prev) => {
        const additional_charges = [...prev.additional_charges];
        additional_charges[index] = { ...additional_charges[index], [field]: value };
        return { ...prev, additional_charges };
      });
    }, []);

    const showToast = (message, type = "success") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3500);
    };

    const handleAction = async (actionType) => {
      if (saving) return;
      if (!formData.client_name || formData.items.length === 0) {
        showToast("Please add a client and at least one item", "warning");
        return;
      }
      setSaving(true);
      try {
        const docPayload = {
          ...formData,
          doc_type: selectedType === 'po' ? 'purchase_order' : selectedType === 'receipt' ? 'receipt' : selectedType === 'credit_note' ? 'credit_note' : 'invoice',
          subtotal, tax_amount: taxAmount, total,
        };
        const res = await authFetch("/api/documents", {
          method: "POST",
          body: JSON.stringify(docPayload),
        });
        if (!res.ok) throw new Error("Failed to save document");
        const savedDoc = await res.json();

        if (actionType === "email") {
          showToast("Sending Email...", "info");
          await authFetch(`/api/documents/${savedDoc.id}/send-email`, {
            method: "POST",
            body: JSON.stringify({ recipientEmail: formData.client_email }),
          });
          showToast(`Sent to ${formData.client_email}`, "success");
        } else if (actionType === "print") {
          showToast("Opening Print Dialog...", "info");
          window.print();
        } else {
          showToast("Preparing PDF...", "info");
          const element = previewRef.current?.getDomElement();
          if (!element) throw new Error("Could not find preview element");

          const widthPx = element.offsetWidth;
          const heightPx = element.offsetHeight;
          const mmWidth = 210;
          const mmHeight = (heightPx / widthPx) * mmWidth;
          const a4Height = 297;
          
          // Logic: 
          // 1. If 5 or fewer items, try to fit on 1 page (up to 15% overflow allowed for shrinking)
          // 2. Otherwise, allow natural paging but shrink slightly if overflow is tiny (<10% of a page)
          let finalFormat = "a4";
          let finalScale = 2;
          const itemCount = formData.items.length;

          if (itemCount <= 5 && mmHeight < a4Height * 1.15) {
            // Force single page by slightly increasing scale or just letting html2pdf fit it
            finalFormat = "a4";
          } else {
            // For longer bills, check if the last page is mostly empty
            const pages = mmHeight / a4Height;
            const overflow = pages % 1;
            if (overflow > 0 && overflow < 0.1) {
              // If last page is <10% full, shrink to fit on previous page
              finalFormat = [mmWidth, Math.floor(pages) * a4Height];
            } else {
              // Natural flow
              finalFormat = "a4";
            }
          }

          const opt = {
            margin: 0,
            image: { type: "jpeg", quality: 1.0 },
            html2canvas: { scale: finalScale, useCORS: true, logging: false },
            jsPDF: { unit: "mm", format: finalFormat, orientation: "portrait" },
            pagebreak: { mode: ['css', 'legacy'] }
          };
          
          const pdfBlob = await window.html2pdf().from(element).set(opt).output("blob");
          const url = window.URL.createObjectURL(pdfBlob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${formData.doc_number}.pdf`;
          a.click();
          showToast("Saved & Downloaded!", "success");
        }
        setSelectedType(null);
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        showToast(err.message, "error");
      } finally {
        setSaving(false);
      }
    };

    if (!selectedType) {
      return (
        <div className="generator-landing">
          <div className="landing-content">
            <div className="landing-header">
              <h1>Create New Document</h1>
              <p>Select a document type to get started with your draft</p>
            </div>
            <div className="selection-grid">
              <div className="selection-card purple" onClick={() => selectType('invoice')}>
                <div className="selection-icon"><i className="fas fa-file-invoice-dollar"></i></div>
                <div className="selection-info">
                  <h3>Invoice</h3>
                  <p>Standard billing for products or services provided to clients.</p>
                </div>
                <div className="selection-arrow"><i className="fas fa-chevron-right"></i></div>
              </div>
              <div className="selection-card blue" onClick={() => selectType('credit_note')}>
                <div className="selection-icon"><i className="fas fa-undo"></i></div>
                <div className="selection-info">
                  <h3>Credit Note</h3>
                  <p>Issued for returns, adjustments, or correcting billing errors.</p>
                </div>
                <div className="selection-arrow"><i className="fas fa-chevron-right"></i></div>
              </div>
              <div className="selection-card green" onClick={() => selectType('po')}>
                <div className="selection-icon"><i className="fas fa-shopping-cart"></i></div>
                <div className="selection-info">
                  <h3>Purchase Order</h3>
                  <p>Formal document to request items from a vendor.</p>
                </div>
                <div className="selection-arrow"><i className="fas fa-chevron-right"></i></div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="generator-page fade-in">
        <div className="generator-header" style={{ padding: '10px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="btn-back" onClick={() => setSelectedType(null)} title="Back">
              <i className="fas fa-arrow-left"></i>
            </button>
            <h1 id="generator-title" style={{ fontSize: '1.1rem', margin: 0 }}>
              <i className={selectedType === 'po' ? 'fas fa-shopping-cart' : selectedType === 'credit_note' ? 'fas fa-undo' : 'fas fa-file-invoice-dollar'}></i>
              {selectedType === 'po' ? ' New Purchase Order' : selectedType === 'credit_note' ? ' New Credit Note' : ' New Invoice'}
            </h1>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn btn-secondary btn-sm" onClick={() => handleAction("email")} disabled={saving}>
              <i className={saving ? "fas fa-spinner fa-spin" : "fas fa-envelope"}></i> Email
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => handleAction("print")} disabled={saving}>
              <i className={saving ? "fas fa-spinner fa-spin" : "fas fa-print"}></i> Print
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => handleAction("download")} disabled={saving}>
              <i className={saving ? "fas fa-spinner fa-spin" : "fas fa-file-download"}></i> Download
            </button>
          </div>
        </div>

        <div className="split-pane">
          <div className="pane-left">
            {selectedType === 'invoice' && (
              <InvoiceForm
                user={user} formData={formData} onChange={handleChange}
                onItemChange={handleItemChange} onAddItem={addItem} onRemoveItem={removeItem}
                onAddCharge={addCharge} onRemoveCharge={removeCharge} onChargeChange={handleChargeChange}
                onFocusSection={handleFocusSection}
                subtotal={subtotal} taxAmount={taxAmount} total={total}
              />
            )}
            {selectedType === 'receipt' && (
              <ReceiptForm
                user={user} formData={formData} onChange={handleChange}
                onItemChange={handleItemChange} onAddItem={addItem} onRemoveItem={removeItem}
                onFocusSection={handleFocusSection}
                total={total}
              />
            )}
            {selectedType === 'po' && (
              <POForm
                user={user} formData={formData} onChange={handleChange}
                onItemChange={handleItemChange} onAddItem={addItem} onRemoveItem={removeItem}
                onAddCharge={addCharge} onRemoveCharge={removeCharge} onChargeChange={handleChargeChange}
                onFocusSection={handleFocusSection}
                subtotal={subtotal} taxAmount={taxAmount} total={total}
              />
            )}
            {selectedType === 'credit_note' && (
              <CreditNoteForm
                user={user} formData={formData} onChange={handleChange}
                onItemChange={handleItemChange} onAddItem={addItem} onRemoveItem={removeItem}
                onAddCharge={addCharge} onRemoveCharge={removeCharge} onChargeChange={handleChargeChange}
                onFocusSection={handleFocusSection}
                subtotal={subtotal} taxAmount={taxAmount} total={total}
              />
            )}
          </div>
          <div className="pane-right">
            {selectedType === 'invoice' && <InvoicePreview ref={previewRef} user={user} data={formData} subtotal={subtotal} taxAmount={taxAmount} total={total} />}
            {selectedType === 'receipt' && <ReceiptPreview ref={previewRef} user={user} data={formData} subtotal={subtotal} taxAmount={taxAmount} total={total} />}
            {selectedType === 'po' && <POPreview ref={previewRef} user={user} data={formData} subtotal={subtotal} taxAmount={taxAmount} total={total} />}
            {selectedType === 'credit_note' && <CreditNotePreview ref={previewRef} user={user} data={formData} subtotal={subtotal} taxAmount={taxAmount} total={total} />}
          </div>
        </div>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    );
  }
