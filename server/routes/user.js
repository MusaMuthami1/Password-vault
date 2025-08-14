const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/me', userController.getProfile);
router.put('/me', userController.updateProfile);
router.put('/password', userController.changePassword);
router.put('/email', userController.changeEmail);
router.put('/2fa', userController.toggle2FA);
router.get('/sessions', userController.getSessions);
router.delete('/sessions/:id', userController.deleteSession);
router.delete('/delete', userController.deleteAccount);

module.exports = router;
