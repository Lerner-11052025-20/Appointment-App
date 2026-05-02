const Resource = require('../models/Resource');

exports.createResource = async (req, res, next) => {
  try {
    const resource = await Resource.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, message: 'Resource created.', data: resource });
  } catch (err) { next(err); }
};

exports.getResources = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { createdBy: req.user._id };
    const resources = await Resource.find(filter).sort('-createdAt');
    res.json({ success: true, data: resources });
  } catch (err) { next(err); }
};

exports.getResourceById = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found.' });
    res.json({ success: true, data: resource });
  } catch (err) { next(err); }
};

exports.updateResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found.' });
    res.json({ success: true, message: 'Resource updated.', data: resource });
  } catch (err) { next(err); }
};

exports.deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found.' });
    res.json({ success: true, message: 'Resource deleted.' });
  } catch (err) { next(err); }
};