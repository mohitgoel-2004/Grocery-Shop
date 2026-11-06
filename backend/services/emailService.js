
const sendEmailOtp = async ({ email, otp }) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    const error = new Error("Email OTP service is not configured");
    error.statusCode = 503;
    error.code = "EMAIL_OTP_NOT_CONFIGURED";
    throw error;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: "Your GroceryHub Login OTP",
        text: `Your GroceryHub login OTP is ${otp}. It expires in 5 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>GroceryHub Login Verification</h2>
            <p>Your login OTP is:</p>
            <h1 style="letter-spacing: 8px;">${otp}</h1>
            <p>This OTP expires in 5 minutes.</p>
            <p>If you did not request this OTP, ignore this email.</p>
          </div>
        `,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      const error = new Error("Unable to send email OTP");
      error.statusCode = response.status >= 500 ? 502 : 400;
      error.details = result;
      throw error;
    }

    console.log("[Email OTP] Email sent successfully:", {
      email,
      id: result.id,
    });

    return result;

  } catch (err) {
    console.error("[Email OTP] Resend delivery failed:", {
      email,
      statusCode: err.statusCode,
      message: err.message,
      details: err.details || null,
    });

    throw err;
  }
};

module.exports = { sendEmailOtp };
