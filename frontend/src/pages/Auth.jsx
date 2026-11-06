import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import grocery from "../assets/grocery.jpeg";
import { sendFirebaseOtp } from "../services/authService";

const AuthPage = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

 const handleContinue = async () => {
  if (loading) return;

  if (!/^[6-9]\d{9}$/.test(phone)) {
    setErrorMessage("Please enter a valid 10-digit Indian mobile number.");
    return;
  }

  try {
    setLoading(true);
    setErrorMessage("");
    await sendFirebaseOtp(phone);

    navigate("/otp", {
      state: {
        mobile: phone,
      },
    });
  } catch (error) {
    setErrorMessage(error.message || "Unable to send OTP. Please try again.");
  } finally {
    setLoading(false);
  }
};
 

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f7f7]">

      {/* Background Image */}
      <img
        src={grocery}
        alt="Grocery"
        className="absolute top-0 left-0 w-full h-[16%] object-cover object-top"
      />

      {/* Dark Gradient */}
      <div className="absolute top-0 left-0 w-full h-[45%] bg-gradient-to-t from-white via-white/20 to-transparent" />

      {/* Bottom Card */}
      <div className="absolute bottom-0 left-0 right-0  bg-white rounded-t-[38px] px-6 pt-6 pb-6 shadow-2xl ">

        {/* Floating Logo */}
        <div className="flex justify-center -mt-16 mb-5">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#145A41] to-[#2D9A72] border-[6px] border-white shadow-2xl flex items-center justify-center text-5xl">
            🛒
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-center text-3xl font-bold text-[#145A41]">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500 mt-3 leading-6">
          Login with your mobile number
          <br />
          and continue shopping.
        </p>

        {/* Phone Input */}
        <div className="mt-8">

          <label className="text-sm font-semibold text-gray-600">
            Mobile Number
          </label>

          <div className="mt-3 flex items-center rounded-2xl border-2 border-gray-200 bg-gray-50 overflow-hidden focus-within:border-[#145A41]">

            <div className="px-5 py-4 font-bold text-[#145A41]">
              +91
            </div>

            <input
              type="tel"
              maxLength={10}
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="Enter Mobile Number"
              className="flex-1 bg-transparent py-4 pr-4 outline-none text-lg"
            />

          </div>

          <div id="recaptcha-container" />
          {errorMessage && (
            <p className="mt-3 text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          )}

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={loading}
            className="w-full mt-7 rounded-full bg-gradient-to-r from-[#145A41] to-[#2D9A72] py-4 text-white text-lg font-semibold shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300"
          >
            {loading ? "Sending OTP..." : "Continue"}
          </button>

        </div>

        {/* Divider */}
        <div className="flex items-center my-8">

          <div className="flex-1 h-[1px] bg-gray-200"></div>

          <span className="mx-4 text-sm text-gray-400">
            OR
          </span>

          <div className="flex-1 h-[1px] bg-gray-200"></div>

        </div>

        {/* Google Button */}
        <button
          type="button"
          disabled
          title="Google login is not available yet"
          className="w-full rounded-full border border-gray-200 bg-white py-4 flex items-center justify-center gap-3 shadow-md opacity-60 cursor-not-allowed"
        >

          <FaGoogle className="text-red-500 text-xl" />

          <span className="font-semibold text-gray-700">
            Google login unavailable
          </span>

        </button>

        {/* Terms */}
        <p className="text-center text-xs text-gray-500 mt-8 leading-6">
          By continuing you agree to our{" "}
          <span className="font-semibold text-[#145A41]">
            Terms & Conditions
          </span>{" "}
          and{" "}
          <span className="font-semibold text-[#145A41]">
            Privacy Policy
          </span>
        </p>

      </div>

    </div>
  );
};

export default AuthPage;