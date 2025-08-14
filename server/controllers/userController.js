const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { email }, { new: true });
    res.json(user);
  } catch (err) { next(err); }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid old password' });
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.json({ message: 'Password changed' });
  } catch (err) { next(err); }
};

exports.changeEmail = async (req, res, next) => {
  try {
    const { newEmail } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { email: newEmail }, { new: true });
    res.json(user);
  } catch (err) { next(err); }
};

exports.toggle2FA = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.twoFactorEnabled = !user.twoFactorEnabled;
    await user.save();
    res.json({ twoFactorEnabled: user.twoFactorEnabled });
  } catch (err) { next(err); }
};

exports.getSessions = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.sessions);
  } catch (err) { next(err); }
};

exports.deleteSession = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.sessions = user.sessions.filter(s => s._id.toString() !== req.params.id);
    await user.save();
    res.json({ message: 'Session deleted' });
  } catch (err) { next(err); }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: 'Account deleted' });
  } catch (err) { next(err); }
};
