import React, { useEffect, useState } from "react";
import {
  FiEdit,
  FiLock,
  FiMail,
  FiPhone,
  FiShield,
  FiCalendar,
  FiCamera,
  FiUser,
  FiMoreVertical,
  FiLoader,
} from "react-icons/fi";
import toast from "react-hot-toast";

import {
  getAdminProfile,
  updateProfile,
  changePassword,
  uploadProfileImage,
} from "../../services/adminProfileService";
import EditProfileSheet from "../../components/admin/EditProfileSheet";
import {useAdminProfile} from "../../Context/AdminProfileContext";

const AdminProfile = () => {
 const {
  adminProfile,
  refreshProfile,
  loading,
} = useAdminProfile();
  const [editOpen, setEditOpen] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  

  const handleImage = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      setImageUploading(true);
      await uploadProfileImage(file);
      await refreshProfile();
   toast.success("Profile image updated");
    } catch (err) {
      console.log(err);
      toast.error("Upload failed");
    } finally {
      setImageUploading(false);
    }
  };

  const handleChangePassword = () => {
    toast("Change password feature will be available soon", {
      icon: "🔒",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <FiLoader className="w-10 h-10 text-green-600 animate-spin" />
          <span className="text-gray-500">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 md:px-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiUser className="text-green-600" />
          My Profile
        </h1>
        <button
          onClick={() => setEditOpen(true)}
          className="flex items-center gap-2 text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
        >
          <FiEdit className="w-4 h-4" />
          Edit
        </button>
      </div>

      {/* Main Card */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Top Section - Avatar & Name */}
        <div className="relative bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-8 sm:px-8">
          <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="relative">
                <img
                  src={
                    adminProfile?.image
                      ? `http://10.13.8.168:5000${adminProfile.image}`
                      : "https://ui-avatars.com/api/?name=Admin&background=10b981&color=fff&size=128"
                  }
                  alt="Profile"
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white shadow-lg"
                />
                {imageUploading && (
                  <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
                    <FiLoader className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-1 right-1 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full cursor-pointer shadow-md transition"
                >
                  <FiCamera className="w-4 h-4" />
                  <input
                    id="avatar-upload"
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImage}
                    disabled={imageUploading}
                  />
                </label>
              </div>
            </div>

            {/* Name & Role */}
            <div className="mt-4 sm:mt-0 text-center sm:text-left flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                {adminProfile?.name || "Admin"}
              </h2>
              <p className="text-gray-500 text-sm sm:text-base flex items-center justify-center sm:justify-start gap-1">
                <FiShield className="w-4 h-4" />
                {adminProfile?.role || "Administrator"}
              </p>
              <p className="text-gray-400 text-sm mt-1 flex items-center justify-center sm:justify-start gap-1">
                <FiCalendar className="w-4 h-4" />
                Joined {new Date(adminProfile?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="px-6 py-6 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3 border border-gray-100">
              <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                <FiMail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                  Email
                </p>
                <p className="text-gray-800 font-medium break-all">
                  {adminProfile?.email || "—"}
                </p>
              </div>
            </div>

            {/* Mobile */}
            <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3 border border-gray-100">
              <div className="p-2 bg-indigo-50 rounded-full text-indigo-600">
                <FiPhone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                  Mobile
                </p>
                <p className="text-gray-800 font-medium">
                  {adminProfile?.mobile || "—"}
                </p>
              </div>
            </div>

            {/* Role */}
            <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3 border border-gray-100">
              <div className="p-2 bg-purple-50 rounded-full text-purple-600">
                <FiShield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                  Role
                </p>
                <p className="text-gray-800 font-medium">
                  {adminProfile?.role || "—"}
                </p>
              </div>
            </div>

            {/* Created At */}
            <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3 border border-gray-100">
              <div className="p-2 bg-emerald-50 rounded-full text-emerald-600">
                <FiCalendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                  Created
                </p>
                <p className="text-gray-800 font-medium">
                  {adminProfile?.createdAt
                    ? new Date(adminProfile.createdAt).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setEditOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-xl transition"
            >
              <FiEdit className="w-5 h-5" />
              Edit Profile
            </button>
            <button
              onClick={handleChangePassword}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-6 py-3 rounded-xl transition"
            >
              <FiLock className="w-5 h-5" />
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Sheet */}
    <EditProfileSheet
    open={editOpen}
    onClose={() => setEditOpen(false)}
    profile={adminProfile}
    onSuccess={refreshProfile}
/>
    </div>
  );
};

export default AdminProfile;