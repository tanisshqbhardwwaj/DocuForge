const DocumentRepository = require("../repositories/DocumentRepository");
const UserRepository = require("../repositories/UserRepository");
const MailService = require("./MailService");

class DocumentService {
  static createDocument(userId, docData) {
    const docId = DocumentRepository.create({ ...docData, user_id: userId });
    return DocumentRepository.findByIdAndUser(docId, userId);
  }

  static getUserDocuments(userId) {
    const docs = DocumentRepository.findByUserId(userId);
    return docs.map((doc) => ({
      ...doc,
      items: JSON.parse(doc.items || "[]"),
    }));
  }

  static getDocumentById(id, userId) {
    const doc = DocumentRepository.findByIdAndUser(id, userId);
    if (doc) {
      doc.items = JSON.parse(doc.items || "[]");
    }
    return doc;
  }

  static deleteDocument(id, userId) {
    return DocumentRepository.delete(id, userId);
  }

  static updatePayment(id, userId, paymentData) {
    const { status, method, transaction_id, related_invoice_number, related_invoice_date } = paymentData;
    return DocumentRepository.updatePaymentStatus(
      id,
      userId,
      status,
      method,
      transaction_id,
      related_invoice_number,
      related_invoice_date
    );
  }

  static async sendEmail(id, userId, recipientEmail) {
    const doc = this.getDocumentById(id, userId);
    if (!doc) throw new Error("Document not found");

    const user = UserRepository.findById(userId);
    if (!user) throw new Error("User not found");

    return await MailService.sendInvoice(user, doc, recipientEmail);
  }
}

module.exports = DocumentService;
