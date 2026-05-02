const crypto = require('crypto');

const generateShareToken = () => {
  return crypto.randomBytes(24).toString('hex');
};

module.exports = generateShareToken;