const express = require('express');
const DocumentController = require('../controllers/DocumentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', DocumentController.getAll);
router.get('/:id', DocumentController.getOne);
router.post('/', DocumentController.create);
router.delete('/:id', DocumentController.delete);
router.patch('/:id/payment', DocumentController.updatePayment);

module.exports = router;

