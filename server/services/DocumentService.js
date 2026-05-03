const DocumentRepository = require('../repositories/DocumentRepository');

class DocumentService {
  static createDocument(userId, docData) {
    const docId = DocumentRepository.create({ ...docData, user_id: userId });
    return DocumentRepository.findByIdAndUser(docId, userId);
  }

  static getUserDocuments(userId) {
    const docs = DocumentRepository.findByUserId(userId);
    return docs.map(doc => ({
      ...doc,
      items: JSON.parse(doc.items || '[]')
    }));
  }

  static getDocumentById(id, userId) {
    const doc = DocumentRepository.findByIdAndUser(id, userId);
    if (doc) {
      doc.items = JSON.parse(doc.items || '[]');
    }
    return doc;
  }

  static deleteDocument(id, userId) {
    return DocumentRepository.delete(id, userId);
  }
}

module.exports = DocumentService;
