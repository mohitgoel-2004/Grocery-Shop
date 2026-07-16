class OtpService {
  async sendOtp({ mobile, otp }) {
    const provider = (process.env.OTP_PROVIDER || "development").toLowerCase();

    if (provider === "development") {
      console.log(`[OTP] ${mobile}: ${otp}`);

      return {
        provider,
        delivered: true,
      };
    }

    if (provider === "twilio") {
      throw new Error("Twilio provider is not configured yet");
    }

    if (provider === "firebase") {
      throw new Error("Firebase provider is not configured yet");
    }

    throw new Error(`Unsupported OTP provider: ${provider}`);
  }
}

module.exports = new OtpService();