const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.list);
router.get('/create', userController.showCreateForm);
router.post('/', userController.create);
router.get('/:id/edit', userController.showEditForm);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

module.exports = router;
