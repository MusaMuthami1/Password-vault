const VaultItem = require('../models/VaultItem');
const { encrypt, decrypt } = require('../utils/encryption');

exports.getVaultItems = async (req, res, next) => {
  try {
    const { search, tags } = req.query;
    let query = { user: req.user.id };
    
    if (search) {
      query.$or = [
        { service: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (tags) {
      query.tags = { $in: tags.split(',') };
    }
    
    const items = await VaultItem.find(query).select('-password');
    res.json(items);
  } catch (err) { 
    console.error('Get vault items error:', err);
    next(err); 
  }
};

exports.addVaultItem = async (req, res, next) => {
  try {
    const { service, username, password, notes, tags } = req.body;
    
    if (!service || !username || !password) {
      return res.status(400).json({ message: 'Service, username, and password are required' });
    }
    
    const encrypted = encrypt(password);
    const item = await VaultItem.create({
      user: req.user.id,
      service,
      username,
      password: JSON.stringify(encrypted),
      notes: notes || '',
      tags: tags || []
    });
    
    const itemResponse = item.toObject();
    delete itemResponse.password;
    
    res.status(201).json(itemResponse);
  } catch (err) { 
    console.error('Add vault item error:', err);
    next(err); 
  }
};

exports.updateVaultItem = async (req, res, next) => {
  try {
    const { service, username, password, notes, tags } = req.body;
    let update = { service, username, notes, tags, updatedAt: new Date() };
    
    if (password) {
      update.password = JSON.stringify(encrypt(password));
    }
    
    const item = await VaultItem.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      update,
      { new: true }
    ).select('-password');
    
    if (!item) return res.status(404).json({ message: 'Vault item not found' });
    res.json(item);
  } catch (err) { 
    console.error('Update vault item error:', err);
    next(err); 
  }
};

exports.deleteVaultItem = async (req, res, next) => {
  try {
    const item = await VaultItem.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!item) return res.status(404).json({ message: 'Vault item not found' });
    res.json({ message: 'Vault item deleted successfully' });
  } catch (err) { 
    console.error('Delete vault item error:', err);
    next(err); 
  }
};

exports.getVaultItem = async (req, res, next) => {
  try {
    const item = await VaultItem.findOne({ _id: req.params.id, user: req.user.id });
    if (!item) return res.status(404).json({ message: 'Vault item not found' });
    
    // Decrypt password for viewing
    const encryptedData = JSON.parse(item.password);
    const decryptedPassword = decrypt(encryptedData.data, encryptedData.tag);
    
    const response = item.toObject();
    response.password = decryptedPassword;
    
    res.json(response);
  } catch (err) { 
    console.error('Get vault item error:', err);
    next(err); 
  }
};

exports.importVault = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items must be an array' });
    }
    
    const importedItems = [];
    for (const item of items) {
      if (item.service && item.username && item.password) {
        const encrypted = encrypt(item.password);
        const newItem = await VaultItem.create({
          user: req.user.id,
          service: item.service,
          username: item.username,
          password: JSON.stringify(encrypted),
          notes: item.notes || '',
          tags: item.tags || []
        });
        importedItems.push(newItem);
      }
    }
    
    res.json({ message: `Imported ${importedItems.length} items successfully`, count: importedItems.length });
  } catch (err) { 
    console.error('Import vault error:', err);
    next(err); 
  }
};

exports.exportVault = async (req, res, next) => {
  try {
    const items = await VaultItem.find({ user: req.user.id });
    const exportData = items.map(item => {
      const encryptedData = JSON.parse(item.password);
      const decryptedPassword = decrypt(encryptedData.data, encryptedData.tag);
      
      return {
        service: item.service,
        username: item.username,
        password: decryptedPassword,
        notes: item.notes,
        tags: item.tags,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      };
    });
    
    res.json({ 
      export: exportData, 
      exportedAt: new Date(),
      count: exportData.length 
    });
  } catch (err) { 
    console.error('Export vault error:', err);
    next(err); 
  }
};
