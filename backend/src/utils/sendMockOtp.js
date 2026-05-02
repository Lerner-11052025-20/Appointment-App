

const generateMockOtp = () => {

  return '123456';
};

const sendMockOtp = async (email, otp) => {

  console.log(`📧 [MOCK] OTP ${otp} sent to ${email}`);
  return true;
};

module.exports = { generateMockOtp, sendMockOtp };