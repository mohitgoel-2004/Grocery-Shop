import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import grocery from "../assets/grocery.jpeg";
import { sendEmailOtp, sendFirebaseOtp } from "../services/authService";

const AuthPage = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState("mobile");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleContinue = async () => {
    if (loading) return;

    if (method === "mobile" && !/^[6-9]\d{9}$/.test(phone)) {
      setErrorMessage("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

   if (
  method === "email" &&
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
) {
  setErrorMessage("Please enter a valid email address.");
  return;
}

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      if (method === "mobile") {
        await sendFirebaseOtp(phone);
      } else {
        await sendEmailOtp(email.trim().toLowerCase());
      }

      navigate("/otp", {
        state: {
          method,
          ...(method === "mobile" ? { mobile: phone } : { email: email.trim().toLowerCase() }),
        },
      });
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          error.message ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const selectMethod = (nextMethod) => {
    setMethod(nextMethod);
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f7f7]">
      <img
        src={grocery}
        alt="Grocery"
        className="absolute left-0 top-0 h-[28%] w-full object-cover object-top sm:h-[36%]"
      />
      <div className="absolute left-0 top-0 h-[48%] w-full bg-gradient-to-t from-white via-white/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 rounded-t-[38px] bg-white px-6 pb-6 pt-6 shadow-2xl sm:px-10">
        <div className="mx-auto max-w-lg">
          <div className="flex justify-center -mt-16 mb-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-[6px] border-white bg-gradient-to-r from-[#145A41] to-[#2D9A72] text-5xl shadow-2xl">
              🛒
            </div>
          </div>

          <h1 className="text-center text-3xl font-bold text-[#145A41]">Welcome Back</h1>
          <p className="mt-3 text-center leading-6 text-gray-500">
            Login to GroceryHub and continue shopping.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-2 rounded-2xl bg-[#eef8f3] p-1">
            {[
              ["mobile", "Mobile Number"],
              ["email", "Email"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => selectMethod(value)}
                className={`rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  method === value
                    ? "bg-[#145A41] text-white shadow"
                    : "text-[#145A41] hover:bg-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <label className="text-sm font-semibold text-gray-600">
              {method === "mobile" ? "Mobile Number" : "Email Address"}
            </label>

            {method === "mobile" ? (
              <div className="mt-3 flex items-center overflow-hidden rounded-2xl border-2 border-gray-200 bg-gray-50 focus-within:border-[#145A41]">
                <div className="px-5 py-4 font-bold text-[#145A41]">+91</div>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="Enter mobile number"
                  className="flex-1 bg-transparent py-4 pr-4 text-lg outline-none"
                />
              </div>
            ) : (
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email address"
                autoComplete="email"
                className="mt-3 w-full rounded-2xl border-2 border-gray-200 bg-gray-50 px-5 py-4 text-lg outline-none focus:border-[#145A41]"
              />
            )}

            {method === "mobile" && <div id="recaptcha-container" />}
            {errorMessage && (
              <p className="mt-3 text-sm text-red-600" role="alert">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="mt-3 text-sm text-[#145A41]" role="status">{successMessage}</p>
            )}

            <button
              onClick={handleContinue}
              disabled={loading}
              className="mt-7 w-full rounded-full bg-gradient-to-r from-[#145A41] to-[#2D9A72] py-4 text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>

          <div className="my-8 flex items-center">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="mx-4 text-sm text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <button
            type="button"
            disabled
            title="Google login is not available yet"
            className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-full border border-gray-200 bg-white py-4 opacity-60 shadow-md"
          >
            <FaGoogle className="text-xl text-red-500" />
            <span className="font-semibold text-gray-700">Google login unavailable</span>
          </button>

          <p className="mt-8 text-center text-xs leading-6 text-gray-500">
            By continuing you agree to our{" "}
            <span className="font-semibold text-[#145A41]">Terms & Conditions</span>{" "}
            and <span className="font-semibold text-[#145A41]">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
