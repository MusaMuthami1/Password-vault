const express = require('express');
const router = express.Router();
const vaultController = require('../controllers/vaultController');

router.get('/', vaultController.getVaultItems);
router.get('/:id', vaultController.getVaultItem);
router.post('/', vaultController.addVaultItem);
router.put('/:id', vaultController.updateVaultItem);
router.delete('/:id', vaultController.deleteVaultItem);
router.post('/import', vaultController.importVault);
router.get('/export/data', vaultController.exportVault);

module.exports = router;
