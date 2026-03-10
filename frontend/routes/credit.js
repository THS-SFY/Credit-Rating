const express = require('express');
const router = express.Router();
const creditController = require('../controllers/creditController');

router.get('/', creditController.showForm);
router.post('/calculate', creditController.calculateScore);

module.exports = router;
