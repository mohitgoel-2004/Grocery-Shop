import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaLocationArrow } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import grocery from "../assets/grocery.jpeg";

const LocationPage = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = `Lat: ${position.coords.latitude.toFixed(
          5
        )}, Lng: ${position.coords.longitude.toFixed(5)}`;

        setAddress(location);
        localStorage.setItem("userAddress", location);
      },
      () => {
        alert("Location permission denied");
      }
    );
  };

  const handleContinue = () => {
    if (!address.trim()) {
      alert("Please select your location");
      return;
    }

    localStorage.setItem("userAddress", address);
    navigate("/home");
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
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[40px] px-6 pt-7 pb-8 shadow-2xl">

        {/* Floating Icon */}
        <div className="flex justify-center -mt-16 mb-5">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#145A41] to-[#2D9A72] border-[6px] border-white shadow-xl flex items-center justify-center">
            <FaMapMarkerAlt className="text-white text-4xl" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-[#145A41]">
          Choose Location
        </h1>

        {/* <p className="text-center text-gray-500 mt-3 leading-6">
          Enable your location to discover nearby stores and get
          faster delivery.
        </p> */}

        {/* Current Location */}
        <button
          onClick={getLocation}
          className="w-full mt-8 rounded-2xl border border-[#145A41] bg-[#eef8f3] p-4 flex items-center gap-4 hover:bg-[#e5f4ed] transition"
        >
          <div className="w-12 h-12 rounded-full bg-[#145A41] flex items-center justify-center">
            <FaLocationArrow className="text-white" />
          </div>

          <div className="text-left">
            <h3 className="font-semibold text-[#145A41]">
              Use Current Location
            </h3>
            <p className="text-sm text-gray-500">
              Detect automatically using GPS
            </p>
          </div>
        </button>

        {/* Address */}
        <div className="mt-6">

          <label className="text-sm font-semibold text-gray-600">
            Delivery Address
          </label>

          <textarea
            rows="2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address..."
            className="mt-3 w-full rounded-2xl border-2 border-gray-200 p-4 outline-none resize-none focus:border-[#145A41]"
          />

        </div>

        {/* Continue */}
        <button
          onClick={handleContinue}
          className="w-full mt-7 rounded-full bg-gradient-to-r from-[#145A41] to-[#2D9A72] py-4 text-lg font-semibold text-white shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
        >
          Continue
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6 leading-6">
          Your location is used only to find nearby stores and
          provide faster deliveries.
        </p>

      </div>
    </div>
  );
};

export default LocationPage;