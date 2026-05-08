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

    const docType =
      document.doc_type === "invoice" ? "Invoice" : "Purchase Order";
    const companyName = user.org_name || user.company_name || "Our Company";

    const mailOptions = {
      from: `"${companyName}" <${user.org_email || user.email}>`,
      to: recipientEmail,
      subject: `${docType} ${document.doc_number} from ${companyName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #7c3aed;">${docType} ${document.doc_number}</h2>
          <p>Dear Customer,</p>
          <p>Please find attached the ${docType.toLowerCase()} for your recent transaction with <strong>${companyName}</strong>.</p>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Amount Due:</strong> ₹${document.total}</p>
            <p style="margin: 5px 0;"><strong>Due Date:</strong> ${document.due_date || "N/A"}</p>
          </div>

          <p>Thank you for your business!</p>
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
          
          <div style="text-align: center; color: #94a3b8; font-size: 12px;">
            <p>This email was sent via <strong>DocuForge</strong> — The Professional Billing Suite.</p>
            <p>&copy; 2026 DocuForge. All rights reserved.</p>
          </div>
        </div>
      `,
      // In a real app, we'd attach a PDF here.
      // For now, we're sending the link/details.
    };

    // If using real SMTP, this would work.
    // await transporter.sendMail(mailOptions);
    console.log(`[MAIL] Sending ${docType} to ${recipientEmail}`);
    return { success: true, message: "Email sent successfully (Simulated)" };
  }
}

module.exports = MailService;
