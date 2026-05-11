const nodemailer = require("nodemailer");

class MailService {
  static async sendInvoice(user, document, recipientEmail) {
    // Note: User should provide SMTP credentials in environment variables
    // For demo/development, we'll use a placeholder or Ethereal
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.ethereal.email",
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER || "mock_user",
        pass: process.env.SMTP_PASS || "mock_pass",
      },
    });

    const docType = document.doc_type === "invoice" ? "Invoice" : document.doc_type === "sales_receipt" ? "Credit Note" : "Purchase Order";
    const companyName = user.org_name || user.company_name || "Our Company";
    const currentCurrency = document.currency || "INR";
    const currencySymbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£", AED: "د.إ" };
    const symbol = currencySymbols[currentCurrency] || "₹";

    const mailOptions = {
      from: `"${companyName}" <${user.org_email || user.email}>`,
      to: recipientEmail,
      subject: `${docType} ${document.doc_number} from ${companyName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; color: #1e293b;">
          <h2 style="color: #7c3aed;">${docType} ${document.doc_number}</h2>
          <p>Dear Customer,</p>
          <p>Please find the details of your ${docType.toLowerCase()} for the transaction with <strong>${companyName}</strong>.</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <p style="margin: 5px 0; font-size: 16px;"><strong>Amount:</strong> ${symbol}${document.total}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> ${document.payment_status?.toUpperCase() || "PENDING"}</p>
            ${document.due_date ? `<p style="margin: 5px 0;"><strong>Due Date:</strong> ${document.due_date}</p>` : ""}
          </div>

          <p>If you have any questions, feel free to reply to this email.</p>
          <p>Thank you for your business!</p>
          
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
          
          <div style="text-align: center; color: #94a3b8; font-size: 12px;">
            <p>Generated via <strong>DocuForge</strong> — Premium Document Suite.</p>
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`[MAIL] Successfully sent ${docType} to ${recipientEmail}`);
      return { success: true, message: `Email sent successfully to ${recipientEmail}` };
    } catch (error) {
      console.error("[MAIL ERROR]", error);
      throw new Error(`Failed to send email: ${error.message}. Check your SMTP credentials in .env`);
    }
  }
}

module.exports = MailService;
