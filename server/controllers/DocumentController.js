const DocumentService = require('../services/DocumentService');

class DocumentController {
  static create(req, res) {
    try {
      const doc = DocumentService.createDocument(req.userId, req.body);
      res.status(201).json(doc);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static getAll(req, res) {
    try {
      const docs = DocumentService.getUserDocuments(req.userId);
      res.json(docs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static getOne(req, res) {
    try {
      const doc = DocumentService.getDocumentById(req.params.id, req.userId);
      if (!doc) return res.status(404).json({ error: 'Document not found' });
      res.json(doc);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static delete(req, res) {
    try {
      DocumentService.deleteDocument(req.params.id, req.userId);
      res.json({ message: 'Document deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = DocumentController;
