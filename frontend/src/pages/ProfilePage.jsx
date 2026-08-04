import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiChevronRight,
  FiLogOut,
  FiMapPin,
  FiSettings,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { fetchProfile, updateProfile } from "../services/api";
import Navbar from "../components/Navbar";
import { useAddress } from "../Context/AddressContext";

const Profile = () => {
  const { defaultAddress } = useAddress();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    landmark: "",
    city: "",
    pincode: "",
  });
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);

    switch (tabId) {
      case "home":
        navigate("/home");
        break;
      case "cart":
        navigate("/cart");
        break;
      case "search":
        // navigate("/search");
        break;
      case "products":
        navigate("/products");
        break;
      case "profile":
        navigate("/profile");
        break;
      default:
        navigate("/home");
    }
  };
  const [activeTab, setActiveTab] = useState("profile");

//   useEffect(() => {
//     const loadProfile = async () => {
//       try {
//         const response = await fetchProfile();
//         const user = response.data.user || {};
//         console.log("User API", user);
// console.log("Context", defaultAddress);

//        setProfile({
//   fullName: user.fullName || "",
//   email: user.email || "",
//   phone: user.mobile || "",

//   address: defaultAddress?.address || user.address || "",
//   landmark: defaultAddress?.landmark || user.landmark || "",
//   city: defaultAddress?.city || user.city || "",
//   pincode: defaultAddress?.pincode || user.pincode || "",
// });
//       } catch (error) {
//         toast.error(error?.response?.data?.message || "Failed to load profile");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadProfile();
//   }, []);

useEffect(() => {
  const loadProfile = async () => {
    try {
      const response = await fetchProfile();

      const user = response.data.user;

      setProfile({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.mobile || "",
      });
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  loadProfile();
}, []);

//   useEffect(() => {
//   if (!defaultAddress) return;

//     console.log("Default Address Changed:", defaultAddress);
//   setProfile((prev) => ({
//     ...prev,
//     fullName: defaultAddress.fullName || prev.fullName,
//     phone: defaultAddress.phone || prev.phone,
//     address: defaultAddress.address || "",
//     landmark: defaultAddress.landmark || "",
//     city: defaultAddress.city || "",
//     pincode: defaultAddress.pincode || "",
//   }));
// }, [defaultAddress]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfile((previous) => ({ ...previous, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!profile.phone || !profile.address) {
      toast.error("Please fill in phone and address.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await updateProfile(profile);
      const user = response.data.user || {};

    setProfile((prev) => ({
  ...prev,
  fullName: user.fullName || prev.fullName,
  email: user.email || prev.email,
  phone: user.mobile || prev.phone,
}));
      localStorage.setItem("authUser", JSON.stringify(user));
      // localStorage.setItem("userAddress", user.address || profile.address);

      toast.success(response?.message || "Profile saved successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
  console.log("Default Address Changed:", defaultAddress);
}, [defaultAddress]);
useEffect(() => {
  console.log("PROFILE STATE =", profile);
}, [profile]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ffffff_0%,#f4f7f4_42%,#e9efe9_100%)] px-0 py-0 md:px-4 md:py-4 lg:px-6">
      <div className="mx-auto flex min-h-screen w-full max-w-107.5 flex-col overflow-hidden bg-white shadow-[0_28px_80px_rgba(15,23,42,0.16)] md:min-h-[calc(100vh-2rem)] md:rounded-[36px] md:border md:border-white/60 lg:max-w-120">
        <div className="shrink-0 border-b border-[#eef0eb] bg-white/95 px-4 pt-4 pb-4 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => navigate(-1)}
              className="grid h-11 w-11 place-items-center rounded-full bg-[#f3f4f6] text-gray-800 shadow-sm transition hover:scale-105 hover:bg-[#eceff1]"
              aria-label="Go back"
            >
              <FiArrowLeft className="text-lg" />
            </button>

            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-400">
                Grocery App
              </p>
              <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                My Profile
              </h2>
            </div>

            <button
              className="grid h-11 w-11 place-items-center rounded-full bg-[#f3f4f6] text-gray-800 shadow-sm transition hover:scale-105 hover:bg-[#eceff1]"
              aria-label="Profile"
            >
              <FiUser className="text-lg" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-2">
          {isLoading ? (
            <div className="py-10 text-center text-gray-500">
              Loading profile...
            </div>
          ) : (
            <div className="mt-6 space-y-5 pb-6">
              <section className="rounded-[28px] border border-[#eef0eb] bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
                <div className="mb-4 flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-green-100 text-green-700">
                    <FiUser className="text-base" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Personal Information
                  </h3>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={profile.fullName}
                    onChange={handleInputChange}
                    className="w-full rounded-[20px] border border-[#e6e8e3] bg-[#f7f8f6] px-4 py-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={profile.email}
                    onChange={handleInputChange}
                    className="w-full rounded-[20px] border border-[#e6e8e3] bg-[#f7f8f6] px-4 py-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={profile.phone}
                    onChange={handleInputChange}
                    className="w-full rounded-[20px] border border-[#e6e8e3] bg-[#f7f8f6] px-4 py-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                </div>
              </section>

              <section className="rounded-[28px] border border-[#eef0eb] bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
                <div className="mb-4 flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-green-100 text-green-700">
                    <FiMapPin className="text-base" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Address Details
                  </h3>
                </div>
                <div className="space-y-3">
                  <textarea
                    rows="2"
                    name="address"
                    placeholder="Street / House / Flat"
                   value={defaultAddress?.address || ""}
                   readOnly
                    onChange={handleInputChange}
                    className="w-full resize-none rounded-[20px] border border-[#e6e8e3] bg-[#f7f8f6] px-4 py-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                  <input
                    type="text"
                    name="landmark"
                    placeholder="Landmark"
                    value={defaultAddress?.landmark || ""}
                    readOnly
                    onChange={handleInputChange}
                    className="w-full rounded-[20px] border border-[#e6e8e3] bg-[#f7f8f6] px-4 py-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={defaultAddress?.city || ""}
                    readOnly
                    onChange={handleInputChange}
                    className="w-full rounded-[20px] border border-[#e6e8e3] bg-[#f7f8f6] px-4 py-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={defaultAddress?.pincode || ""}
                    readOnly
                    onChange={handleInputChange}
                    className="w-full rounded-[20px] border border-[#e6e8e3] bg-[#f7f8f6] px-4 py-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                </div>
              </section>

              <section className="rounded-[28px] border border-[#eef0eb] bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
                <div className="mb-4 flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-green-100 text-green-700">
                    <FiSettings className="text-base" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">
                    My Account
                  </h3>
                </div>

                <div className="space-y-3">
                  {[
                    { title: "My Orders", icon: "📦", route: "/orders" },
                    { title: "My Addresses", icon: "📍", route: "/addresses" },
                    { title: "Payment Methods", icon: "💳", route: "/payment" },
                    { title: "Help & Support", icon: "📞", route: "/support" },
                    { title: "Settings", icon: "⚙️", route: "/settings" },
                  ].map((item) => (
                    <button
                      key={item.title}
                      onClick={() => navigate(item.route)}
                      className="flex w-full items-center justify-between rounded-[20px] border border-[#eef0eb] bg-[#fafafa] px-4 py-4 text-left transition hover:-translate-y-0.5 hover:bg-[#f4faf6]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium text-gray-800">
                          {item.title}
                        </span>
                      </div>
                      <FiChevronRight className="text-lg text-gray-400" />
                    </button>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className={`flex items-center justify-center gap-2 rounded-3xl py-4 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(16,185,129,0.25)] transition hover:scale-[1.01] ${
                    isSaving
                      ? "cursor-not-allowed bg-gray-300"
                      : "bg-linear-to-r from-green-600 to-teal-600"
                  }`}
                >
                  {isSaving ? "Saving..." : "Save Profile"}
                </button>

                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("authUser");
                    localStorage.removeItem("authMobile");
                    localStorage.removeItem("userAddress");
                    window.dispatchEvent(new Event("auth:changed"));
                    navigate("/");
                  }}
                  className="flex items-center justify-center gap-2 rounded-3xl bg-red-500 py-4 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(239,68,68,0.18)] transition hover:scale-[1.01] hover:bg-red-600"
                >
                  <FiLogOut className="text-base" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
        <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
};

export default Profile;
