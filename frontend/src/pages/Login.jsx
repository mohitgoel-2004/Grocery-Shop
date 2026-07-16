import { useNavigate } from "react-router-dom";
import React from "react";
import grocery from "../assets/grocery.jpeg";



const LoginPage = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#eef8f3] flex flex-col overflow-hidden">

      {/* ================= Top Section ================= */}
      <div className="relative h-[52vh] sm:h-[55vh] overflow-hidden bg-gradient-to-b from-[#145A41] via-[#1F6F54] to-[#EEF8F3]">

        {/* Background Decorative Blobs */}
        <div className="absolute -top-20 -left-16 w-60 h-60 rounded-full bg-white/10 blur-3xl"></div>

        <div className="absolute top-12 -right-16 w-52 h-52 rounded-full bg-[#5be7b2]/20 blur-3xl"></div>

        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-white/5 blur-3xl"></div>

        {/* Floating Badge */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
          <div className="px-2 py-1 rounded-full bg-white/15 backdrop-blur-xl border border-white/20 shadow-xl">
            <p className="text-white text-sm font-medium">
              🥬 Fresh • Fast • Organic
            </p>
          </div>
        </div>

        {/* Image */}
        <div className="absolute inset-0 flex items-end justify-center z-10">
          <img
            src={grocery}
            alt="Grocery"
            className="w-full h-[90%] object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.35)]"
          />
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
      </div>

      {/* ================= Bottom Card ================= */}
      <div className="flex-1 bg-white rounded-t-[40px] -mt-8 relative z-30 px-6 pt-8 pb-8 shadow-[0_-20px_40px_rgba(0,0,0,0.08)] flex flex-col justify-between">

        <div>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="px-6 py-3 rounded-full bg-gradient-to-r from-[#145A41] to-[#2D9A72] text-white text-lg font-bold shadow-xl">
              🛒 GroceryGo
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-center text-[#103B2C] text-3xl sm:text-4xl font-bold leading-tight">
            Fresh groceries
            <br />
            delivered in minutes
          </h1>

          {/* Description */}
          <p className="mt-5 text-center text-gray-500 text-[15px] leading-7">
            Shop fresh fruits, vegetables, dairy, snacks and daily essentials
            from nearby stores with lightning-fast delivery.
          </p>
          

        </div>

        {/* Bottom Buttons */}
        <div className="mt-10">

          <button  onClick={() => navigate("/auth")} className="w-full py-4 rounded-full bg-gradient-to-r from-[#145A41] to-[#2D9A72] text-white text-lg font-semibold shadow-xl transition duration-300 hover:scale-[1.02] active:scale-95">
            Get Started
          </button>

          <button className="w-full mt-4 py-4 rounded-full border-2 border-[#1F6F54] bg-white text-[#1F6F54] text-lg font-semibold transition duration-300 hover:bg-[#eef8f3] active:scale-95">
            I already have an account
          </button>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-500 leading-6">
            By continuing you agree to our{" "}
            <span className="text-[#1F6F54] font-semibold cursor-pointer">
              Terms & Conditions
            </span>{" "}
            and{" "}
            <span className="text-[#1F6F54] font-semibold cursor-pointer">
              Privacy Policy
            </span>
            .
          </p>

        </div>

      </div>

    </div>
  );
};

export default LoginPage;