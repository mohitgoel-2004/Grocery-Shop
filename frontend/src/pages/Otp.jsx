import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate  } from "react-router-dom";
import { verifyOtp } from "../services/authService";
import { ShieldCheck } from "lucide-react";
import grocery from "../assets/grocery.jpeg";

const OtpPage = () => {
  const navigate = useNavigate();
      const location = useLocation();

const mobile = location.state?.mobile;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

 const handleVerify = async () => {
  const code = otp.join("");

  if (code.length !== 6) {
    alert("Enter complete OTP");
    return;
  }

 try {
  const response = await verifyOtp(mobile, code);

  // console.log("STEP 1", response);

  // const token = response?.data?.accessToken;

  localStorage.setItem("customerToken", response.data.accessToken);

 // console.log("STEP 3");
 localStorage.setItem("user", JSON.stringify(response.data.user));

  console.log(localStorage.getItem("customerToken"));

  navigate("/location");
} catch (err) {
  console.error("VERIFY ERROR:", err);
}
 };

  const resendOtp = () => {
    setTimer(30);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f7f7]">

      {/* Background Image */}
      <img
        src={grocery}
        alt="Grocery"
        className="absolute top-0 left-0 w-full h-[52%] object-cover object-top"
      />

      {/* Gradient */}
      <div className="absolute top-0 left-0 w-full h-[52%] bg-gradient-to-t from-white via-white/20 to-transparent" />

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[38px] px-6 pt-7 pb-8 shadow-2xl">

        {/* Floating Lock */}
        <div className="flex justify-center -mt-16 mb-5">

          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#145A41] to-[#2D9A72] border-[6px] border-white shadow-xl flex items-center justify-center text-5xl">
        <ShieldCheck size={42} color="white" />
          </div>

        </div>

        {/* Heading */}

        <h1 className="text-3xl font-bold text-center text-[#145A41]">
          Verify OTP
        </h1>

        <p className="text-center text-gray-500 mt-3 leading-6">
          Enter the 6-digit verification code sent to your mobile number.
        </p>

        {/* OTP Boxes */}

        <div className="flex justify-between mt-8 gap-2">

          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-14 rounded-2xl border-2 border-gray-200 text-center text-xl font-bold focus:border-[#145A41] focus:ring-2 focus:ring-[#145A41]/20 outline-none transition-all"
            />
          ))}

        </div>

        {/* Verify Button */}

        <button
          onClick={handleVerify}
          className="w-full mt-8 rounded-full bg-gradient-to-r from-[#145A41] to-[#2D9A72] py-4 text-lg font-semibold text-white shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300"
        >
          Verify OTP
        </button>

        {/* Timer */}

        <div className="mt-6 text-center">

          {timer > 0 ? (
            <p className="text-gray-500">
              Resend OTP in{" "}
              <span className="font-semibold text-[#145A41]">
                {timer}s
              </span>
            </p>
          ) : (
            <button
              onClick={resendOtp}
              className="font-semibold text-[#145A41] hover:underline"
            >
              Resend OTP
            </button>
          )}

        </div>

        {/* Footer */}

        <p className="text-center text-xs text-gray-500 mt-8 leading-6">
          Didn't receive the code?
          <br />
          Please check your SMS or request a new OTP.
        </p>

      </div>

    </div>
  );
};

export default OtpPage;