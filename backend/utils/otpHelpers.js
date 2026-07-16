const generateOtpExpiry = (minutes = 5) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

module.exports = {
  generateOtpExpiry,
};