import React, { useEffect, useState } from "react";
import {
  FiX,
  FiHome,
  FiBriefcase,
  FiMapPin,
  FiUser,
  FiPhone,
  FiNavigation,
  FiSave,
  FiTrash2,
} from "react-icons/fi";

const initialForm = {
  fullName: "",
  phone: "",
  address: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  type: "Home",
};

const AddressFormModal = ({
  open,
  onClose,
  onSave,
  address,
}) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (address) {
      setForm({
        fullName: address.fullName || "",
        phone: address.phone || "",
        address: address.address || "",
        landmark: address.landmark || "",
        city: address.city || "",
        state: address.state || "",
        pincode: address.pincode || "",
        type: address.type || "Home",
      });
    } else {
      setForm(initialForm);
    }
  }, [address, open]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = () => {
    if (
      !form.fullName ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      alert("Please fill all required fields");
      return;
    }

    onSave(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden animate-slideUp max-h-[95vh] sm:max-h-[90vh]"
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="h-1.5 w-14 rounded-full bg-gray-300"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 bg-gradient-to-r from-emerald-50 to-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100">
              <FiMapPin className="text-emerald-600" size={18} />
            </div>
            <h2 className="text-lg font-bold text-gray-800">
              {address ? "Edit Address" : "Add New Address"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-gray-100 p-2 hover:bg-gray-200 transition-all duration-200 hover:scale-105"
          >
            <FiX size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-5 pb-6 pt-4 space-y-4">
          {/* Full Name */}
          <div className="relative">
            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-11 pr-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Mobile Number"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-11 pr-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>

          {/* Address */}
          <div className="relative">
            <FiNavigation className="absolute left-4 top-4 text-gray-400" size={16} />
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="House No, Building, Street..."
              rows={3}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-11 pr-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 resize-none"
            />
          </div>

          {/* Landmark */}
          <input
            name="landmark"
            value={form.landmark}
            onChange={handleChange}
            placeholder="Landmark (Optional)"
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          />

          {/* City & State */}
          <div className="grid grid-cols-2 gap-3">
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className="rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State"
              className="rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>

          {/* Pincode */}
          <input
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          />

          {/* Address Type */}
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-700">
              Address Type
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    type: "Home",
                  })
                }
                className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium border-2 transition-all duration-200 ${
                  form.type === "Home"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-200/50"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <FiHome className={`text-base ${form.type === "Home" ? "text-emerald-600" : "text-gray-400"}`} />
                Home
              </button>

              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    type: "Work",
                  })
                }
                className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium border-2 transition-all duration-200 ${
                  form.type === "Work"
                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm shadow-blue-200/50"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <FiBriefcase className={`text-base ${form.type === "Work" ? "text-blue-600" : "text-gray-400"}`} />
                Work
              </button>

              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    type: "Other",
                  })
                }
                className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium border-2 transition-all duration-200 ${
                  form.type === "Other"
                    ? "border-amber-500 bg-amber-50 text-amber-700 shadow-sm shadow-amber-200/50"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <FiMapPin className={`text-base ${form.type === "Other" ? "text-amber-600" : "text-gray-400"}`} />
                Other
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 bg-white py-3.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 hover:border-gray-300"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={submit}
              className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-200/50 transition hover:from-emerald-600 hover:to-emerald-700 hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <FiSave size={16} />
              {address ? "Update Address" : "Save Address"}
            </button>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        @media (min-width: 640px) {
          .animate-slideUp {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

export default AddressFormModal;