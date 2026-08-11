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
  FiMail,
  FiPhone,
  FiHome,
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
      toast.success(response?.message || "Profile saved successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-0 py-0 md:px-4 md:py-4 lg:px-6">
      <div className="mx-auto flex min-h-screen w-full max-w-107.5 flex-col overflow-hidden bg-white md:min-h-[calc(100vh-2rem)] md:rounded-[30px] md:border md:border-emerald-100 lg:max-w-120">
        
        {/* Header - Matching Home Page */}
        <div className="shrink-0 bg-gradient-to-b from-emerald-100 via-emerald-50 to-white px-4 pt-4 pb-3">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => navigate(-1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-emerald-100 bg-white shadow-sm transition hover:scale-105 hover:bg-emerald-50"
              aria-label="Go back"
            >
              <FiArrowLeft className="text-lg text-emerald-600" />
            </button>

            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-600">
                Grocery App
              </p>
              <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                My Profile
              </h2>
            </div>

            <button
              className="grid h-11 w-11 place-items-center rounded-full border border-emerald-100 bg-white shadow-sm transition hover:scale-105 hover:bg-emerald-50"
              aria-label="Profile"
            >
              <FiUser className="text-lg text-emerald-600" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-4">
          {isLoading ? (
            <div className="py-10 text-center text-gray-500">
              Loading profile...
            </div>
          ) : (
            <div className="space-y-4 pb-6">
              {/* Profile Avatar Section */}
              <div className="flex flex-col items-center py-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200/50">
                    <span className="text-3xl font-bold">
                      {profile.fullName?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1.5 border-2 border-white">
                    <FiUser className="text-white text-xs" />
                  </div>
                </div>
                <h3 className="mt-3 text-lg font-bold text-gray-900">
                  {profile.fullName || "User"}
                </h3>
                <p className="text-sm text-gray-500">{profile.email}</p>
              </div>

              {/* Personal Information */}
              <section className="rounded-2xl border border-emerald-100/80 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-50">
                    <FiUser className="text-emerald-600" size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800">
                    Personal Information
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={profile.fullName}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-11 pr-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={profile.email}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-11 pr-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={profile.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-11 pr-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>
              </section>

              {/* Address Details */}
              <section className="rounded-2xl border border-emerald-100/80 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-50">
                    <FiMapPin className="text-emerald-600" size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800">
                    Address Details
                  </h3>
                  <button
                    onClick={() => navigate("/addresses")}
                    className="ml-auto text-xs font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    Change
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <FiHome className="absolute left-4 top-4 text-gray-400" size={16} />
                    <textarea
                      rows="2"
                      name="address"
                      placeholder="Street / House / Flat"
                      value={defaultAddress?.address || ""}
                      readOnly
                      className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 pl-11 pr-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="landmark"
                      placeholder="Landmark"
                      value={defaultAddress?.landmark || ""}
                      readOnly
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400"
                    />
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={defaultAddress?.city || ""}
                      readOnly
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400"
                    />
                  </div>
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={defaultAddress?.pincode || ""}
                    readOnly
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400"
                  />
                </div>
              </section>

              {/* My Account */}
              <section className="rounded-2xl border border-emerald-100/80 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-50">
                    <FiSettings className="text-emerald-600" size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800">
                    My Account
                  </h3>
                </div>

                <div className="space-y-2">
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
                      className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-gray-50/30 px-4 py-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50/30 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm font-medium text-gray-700">
                          {item.title}
                        </span>
                      </div>
                      <FiChevronRight className="text-lg text-gray-400" />
                    </button>
                  ))}
                </div>
              </section>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className={`flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-200/50 transition hover:scale-[1.01] ${
                    isSaving
                      ? "cursor-not-allowed bg-gray-300 shadow-none"
                      : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
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
                  className="flex items-center justify-center gap-2 rounded-2xl bg-red-50 border border-red-200 py-3.5 text-sm font-bold text-red-600 transition hover:bg-red-100 hover:scale-[1.01]"
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