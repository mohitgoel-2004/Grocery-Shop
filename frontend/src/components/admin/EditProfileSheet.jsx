import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiX, FiUser, FiMail, FiPhone } from "react-icons/fi";
import toast from "react-hot-toast";
import { updateProfile } from "../../services/adminProfileService";
import { useAdminProfile } from "../../Context/AdminProfileContext";

const EditProfileSheet = ({
  open,
  onClose,
  profile,
  onSuccess,
}) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [loading, setLoading] = useState(false);
  const { refreshProfile } = useAdminProfile();

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        email: profile.email || "",
        mobile: profile.mobile || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      return toast.error("Name is required");
    }

    if (!form.email.trim()) {
      return toast.error("Email is required");
    }

    if (!form.mobile.trim()) {
      return toast.error("Mobile is required");
    }

    try {
      setLoading(true);

     const res = await updateProfile(form);

// Context refresh
await refreshProfile();

// Optional parent refresh
if (onSuccess) {
  onSuccess();
}

toast.success(res.message || "Profile updated successfully");

onClose();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black backdrop-blur-sm"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 260,
            }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white shadow-2xl"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3">
              <div className="h-1.5 w-14 rounded-full bg-gray-300" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <h2 className="text-xl font-bold">
                Edit Profile
              </h2>

              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <FiX size={22} />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-5 px-6 pb-8">

              {/* Name */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FiUser />
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                  placeholder="Enter full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FiMail />
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                  placeholder="Enter email"
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FiPhone />
                  Mobile
                </label>

                <input
                  type="text"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                  placeholder="Enter mobile number"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-gray-300 py-3 font-semibold transition hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSubmit}
                  className="flex-1 rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                >
                  {loading
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditProfileSheet;